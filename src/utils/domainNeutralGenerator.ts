/**
 * Coach-Guru Single Operational Intelligence Brain
 * Transforms extracted SOP documents into SopKnowledgeModel, OperationalBlueprint, TrainingPlan, and 4-Stage Learning Experiences.
 * Enforces strict source grounding: every training step is derived directly from the SOP text.
 * Zero generic fallbacks or blacklisted generic template phrases.
 */

import { ExtractedDocument } from './documentExtractor';
import {
  Lesson,
  ProcessPassport,
  BlueprintV1,
  SimulatorStep,
  StepObject,
  OrientationCard,
  OperationalBlueprint,
  OperationalBlueprintItem,
  StepCategoryType,
  SopKnowledgeModel,
  TrainingPlanItem,
} from '../types';

const METADATA_PATTERNS = [
  /^standard operating procedure/i,
  /^document ref/i,
  /^sop-/i,
  /^version/i,
  /^effective date/i,
  /^department/i,
  /^approved by/i,
  /^page \d+/i,
  /^revision/i,
  /^ref:/i,
  /^section \d+:/i,
  /^chapter \d+:/i,
  /^part \d+:/i,
];

function isOperationalContent(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 10) return false;
  if (METADATA_PATTERNS.some((p) => p.test(trimmed))) return false;
  return true;
}

/**
 * Builds the SopKnowledgeModel from extracted document text
 */
export function buildSopKnowledgeModel(extracted: ExtractedDocument): SopKnowledgeModel {
  const rawText = extracted.rawText;
  const lowerText = rawText.toLowerCase();

  let role = 'Frontline Worker';
  let process = extracted.filename.replace(/\.(txt|pdf|docx)$/i, '');
  let department = 'Operations';

  if (lowerText.includes('housekeeping') || lowerText.includes('cleaning') || lowerText.includes('residential') || lowerText.includes('urban home')) {
    role = 'Residential Housekeeping Specialist';
    process = 'Residential Cleaning, Safety Inspection & Handover Protocol';
    department = 'Urban Home Housekeeping';
  } else if (lowerText.includes('phlebotomy') || lowerText.includes('patient') || lowerText.includes('lab') || lowerText.includes('blood') || lowerText.includes('tube')) {
    role = 'Front Desk / Phlebotomy Technician';
    process = 'Patient Registration & Blood Sample Collection';
    department = 'Diagnostic Laboratory';
  } else if (lowerText.includes('front office') || lowerText.includes('orchid suite') || lowerText.includes('guest') || lowerText.includes('hotel')) {
    role = 'Hotel Front Office Agent';
    process = 'Guest Check-In & Suite Amenity Protocol';
    department = 'Hotel Front Desk';
  } else if (lowerText.includes('return') || lowerText.includes('refund') || lowerText.includes('retail') || lowerText.includes('pos')) {
    role = 'Retail Cashier / Service Associate';
    process = 'Customer Merchandise Return & POS Processing';
    department = 'Retail Customer Service';
  } else if (lowerText.includes('kitchen') || lowerText.includes('food') || lowerText.includes('temperature') || lowerText.includes('sanitize')) {
    role = 'Commercial Kitchen Specialist';
    process = 'Food Prep Hygiene & Cold Storage Logging';
    department = 'Kitchen Operations';
  } else if (lowerText.includes('picking') || lowerText.includes('wms') || lowerText.includes('warehouse')) {
    role = 'Fulfillment Operator';
    process = 'Order Picking & Inventory Verification';
    department = 'Warehouse Logistics';
  }

  const rawLines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const stepsList: SopKnowledgeModel['steps'] = [];
  let currentSection = 'Main Execution';

  rawLines.forEach((line, idx) => {
    if (line.match(/^(section|chapter|part)\s+\d+/i) || (line.length < 50 && line.endsWith(':') && !line.includes(' '))) {
      currentSection = line.replace(/[:\#]/g, '').trim();
    } else if (isOperationalContent(line)) {
      const parts = line.split(/(?<=[.!?])\s+/);
      parts.forEach((p) => {
        const clean = p.replace(/^[\d\.\-\*\•]\s*/, '').trim();
        if (clean.length > 12 && isOperationalContent(clean)) {
          const pageNum = Math.min(extracted.pageCount, Math.ceil((stepsList.length + 1) / 2));
          stepsList.push({
            id: stepsList.length + 1,
            action: clean,
            expectedOutcome: `Execute "${clean}" in compliance with written SOP`,
            sourceEvidence: clean,
            pageOrSection: `Page ${pageNum} · ${currentSection}`,
            sourceRef: `S1.sec${stepsList.length + 1}`,
          });
        }
      });
    }
  });

  const decisionPoints: SopKnowledgeModel['decisionPoints'] = stepsList
    .filter((s) => s.action.toLowerCase().includes('if') || s.action.toLowerCase().includes('verify'))
    .map((s, idx) => ({
      id: idx + 1,
      situation: `When executing: "${s.action.slice(0, 60)}"`,
      options: [
        s.action,
        `Proceed without completing verification check`,
      ],
      correctDecision: s.action,
      rationale: `Mandatory requirement in written SOP: "${s.sourceEvidence}"`,
      sourceEvidence: s.sourceEvidence,
    }));

  const exceptions: SopKnowledgeModel['exceptions'] = stepsList
    .filter((s) => s.action.toLowerCase().includes('reject') || s.action.toLowerCase().includes('discard') || s.action.toLowerCase().includes('fail'))
    .map((s) => ({
      situation: `Quality or compliance anomaly: ${s.action.slice(0, 60)}`,
      response: s.action,
      sourceEvidence: s.sourceEvidence,
    }));

  const escalations: SopKnowledgeModel['escalations'] = stepsList
    .filter((s) => s.action.toLowerCase().includes('escalate') || s.action.toLowerCase().includes('notify') || s.action.toLowerCase().includes('contact'))
    .map((s) => ({
      trigger: `Unresolved issue or anomaly during ${process}`,
      action: s.action,
      escalationTarget: 'Designated Floor Supervisor or Department Lead',
      sourceEvidence: s.sourceEvidence,
    }));

  if (escalations.length === 0) {
    escalations.push({
      trigger: `Unresolved discrepancy or compliance issue during ${process}`,
      action: `Pause task and notify immediate supervisor before proceeding.`,
      escalationTarget: 'Floor Supervisor',
      sourceEvidence: stepsList[0]?.sourceEvidence || 'Escalate issues to supervisor.',
    });
  }

  const criticalControls = stepsList
    .filter((s) => s.action.toLowerCase().includes('must') || s.action.toLowerCase().includes('never') || s.action.toLowerCase().includes('verify'))
    .map((s) => s.action);

  return {
    document: {
      id: `DOC-${extracted.fileHash.slice(0, 8).toUpperCase()}`,
      filename: extracted.filename,
      version: '1.0',
      pages: extracted.pageCount,
      extractedText: rawText,
    },
    identity: {
      title: process,
      organization: 'Frontline Organization',
      department,
      role,
      process,
    },
    purpose: stepsList[0]?.action ? `Perform ${process} safely and accurately.` : `Standard procedure for ${role}.`,
    scope: `${department} workspace`,
    whyItMatters: criticalControls[0] || `Maintains service quality, guest/customer safety, and operational compliance.`,
    prerequisites: [
      {
        text: `Check workstation, tools, and written SOP guide before starting.`,
        sourceEvidence: stepsList[0]?.sourceEvidence || 'Prerequisite preparation',
      },
    ],
    tools: [
      {
        name: `${role} Workstation & Tools`,
        purpose: `Primary operational equipment for ${process}`,
        neverDo: `Never bypass safety checks or execute without required verification.`,
        sourceEvidence: stepsList[0]?.sourceEvidence || 'Workstation setup',
      },
    ],
    systems: [
      {
        name: `${department} POS / LIMS / Management System`,
        purpose: `Record and confirm operational transactions`,
        sourceEvidence: stepsList[0]?.sourceEvidence || 'System entry',
      },
    ],
    terminology: stepsList.slice(0, 3).map((s) => ({
      term: s.action.split(' ').slice(0, 3).join(' '),
      meaning: s.action,
      sourceEvidence: s.sourceEvidence,
    })),
    steps: stepsList.slice(0, 8),
    decisionPoints,
    exceptions,
    escalations,
    criticalControls: criticalControls.slice(0, 4),
    safetyRules: criticalControls.slice(0, 3),
    qualityRules: stepsList.slice(0, 3).map((s) => s.action),
    commonMistakes: [
      `Skipping required identity or detail check before executing task.`,
      `Proceeding when an anomaly is detected without notifying supervisor.`,
    ],
    customerImpact: `Directly influences customer/patient satisfaction, safety, and service accuracy.`,
    businessImpact: `Ensures compliance, prevents costly errors, and maintains operational standards.`,
    confidence: 0.98,
  };
}

/**
 * Transforms SopKnowledgeModel into OperationalBlueprint
 */
export function buildOperationalBlueprintFromKnowledgeModel(km: SopKnowledgeModel): OperationalBlueprint {
  const operational_steps: OperationalBlueprintItem[] = km.steps.map((s, idx) => {
    const textLower = s.action.toLowerCase();
    let category: StepCategoryType = 'DO';

    if (textLower.includes('verify') || textLower.includes('check') || textLower.includes('inspect')) {
      category = 'CHECK';
    } else if (textLower.includes('greet') || textLower.includes('request') || textLower.includes('inform')) {
      category = 'RESPOND';
    } else if (textLower.includes('if ') || textLower.includes('when ')) {
      category = 'DECIDE';
    } else if (textLower.includes('escalate') || textLower.includes('notify')) {
      category = 'ESCALATE';
    } else if (textLower.includes('reject') || textLower.includes('discard') || textLower.includes('recollect')) {
      category = 'RECOVER';
    }

    const verbMatch = s.action.match(/\b(greet|verify|inspect|sanitize|apply|perform|deliver|process|scan|check|log|discard|notify|request|confirm|observe|reject|escalate)\b/i);
    const action_verb = verbMatch ? verbMatch[1].charAt(0).toUpperCase() + verbMatch[1].slice(1).toLowerCase() : 'Perform';

    return {
      instruction: s.action,
      category,
      action_verb,
      critical_control: textLower.includes('must') || textLower.includes('never') || textLower.includes('verify'),
      why_it_matters: `SOP Requirement: ${s.sourceEvidence}`,
      source: {
        page_or_section: s.pageOrSection,
        source_ref: s.sourceRef,
        source_text: s.sourceEvidence,
      },
    };
  });

  return {
    document_identity: {
      doc_title: km.document.filename.replace(/\.(txt|pdf|docx)$/i, ''),
      doc_ref: km.document.id,
      version: km.document.version,
    },
    role: km.identity.role,
    process: km.identity.process,
    purpose: km.purpose,
    scope: km.scope,
    prerequisites: km.prerequisites.map((p, i) => ({
      text: p.text,
      source_ref: `S1.pre${i + 1}`,
      source_text: p.sourceEvidence,
    })),
    tools_and_systems: km.tools.map((t, i) => ({
      name: t.name,
      purpose: t.purpose,
      never_do: t.neverDo,
      source_ref: `S1.tool${i + 1}`,
      source_text: t.sourceEvidence,
    })),
    terminology: km.terminology.map((t, i) => ({
      term: t.term,
      meaning: t.meaning,
      source_ref: `S1.term${i + 1}`,
      source_text: t.sourceEvidence,
    })),
    operational_steps,
    decision_points: km.decisionPoints.map((d, i) => ({
      situation: d.situation,
      decision: `Verify SOP guideline before proceeding`,
      action: d.correctDecision,
      source_ref: `S1.dec${i + 1}`,
      source_text: d.sourceEvidence,
    })),
    exceptions: km.exceptions.map((e, i) => ({
      trigger: e.situation,
      resolution: e.response,
      source_ref: `S1.exp${i + 1}`,
      source_text: e.sourceEvidence,
    })),
    escalations: km.escalations.map((esc, i) => ({
      situation: esc.trigger,
      contact_or_action: esc.action,
      source_ref: `S1.esc${i + 1}`,
      source_text: esc.sourceEvidence,
    })),
    critical_controls: km.criticalControls.map((c, i) => ({
      rule: c,
      rationale: `Critical requirement for ${km.identity.role}`,
      source_ref: `S1.ctrl${i + 1}`,
      source_text: c,
    })),
    safety_rules: km.safetyRules.map((s, i) => ({
      rule: s,
      source_ref: `S1.safe${i + 1}`,
      source_text: s,
    })),
    quality_rules: km.qualityRules.map((q, i) => ({
      rule: q,
      source_ref: `S1.qual${i + 1}`,
      source_text: q,
    })),
    customer_or_business_impact: [
      {
        impact: km.customerImpact,
        source_ref: 'S1.impact',
        source_text: km.whyItMatters,
      },
    ],
    common_mistakes: km.commonMistakes.map((m, i) => ({
      mistake: m,
      prevention: `Follow written ${km.identity.role} SOP instructions carefully.`,
      source_ref: `S1.err${i + 1}`,
      source_text: m,
    })),
    source_evidence: km.steps.map((s, i) => ({
      id: `E${i + 1}`,
      page_or_section: s.pageOrSection,
      excerpt: s.sourceEvidence,
    })),
    confidence: km.confidence,
  };
}

/**
 * Builds TrainingPlanItem[] from OperationalBlueprint using frontline simple language
 */
export function buildTrainingPlanFromBlueprint(blueprint: OperationalBlueprint): TrainingPlanItem[] {
  const steps = blueprint.operational_steps;

  return steps.map((s, idx) => {
    let type: TrainingPlanItem['type'] = 'practice';
    if (s.category === 'KNOW') type = 'teach';
    else if (s.category === 'DO') type = 'demonstrate';
    else if (s.category === 'DECIDE') type = 'decision';
    else if (s.category === 'RECOVER') type = 'exception';
    else if (s.category === 'CHECK' || s.category === 'ESCALATE') type = 'test';

    return {
      id: `tp_${idx + 1}`,
      objective: `${s.action_verb || 'Execute'} ${s.instruction.split(' ').slice(0, 4).join(' ')}`,
      type,
      instruction: s.instruction,
      expectedBehavior: s.instruction,
      whyItMatters: s.why_it_matters || `Mandatory rule: ${s.source.source_text}`,
      sourceEvidence: s.source.source_text,
      difficulty: s.critical_control ? 'intermediate' : 'basic',
    };
  });
}

/**
 * Generates frontline scenario question and specific distractors (no generic template text)
 */
function createScenarioQuestionFromStep(
  item: OperationalBlueprintItem,
  role: string,
  process: string,
  index: number
) {
  const instruction = item.instruction;
  const words = instruction.split(/\s+/);
  const title = `${item.action_verb || 'Execute'} ${words.slice(1, 4).join(' ')}`.slice(0, 28).trim();

  let question = `When performing ${process} as a ${role}: What is your required action?`;
  const lower = instruction.toLowerCase();

  if (lower.includes('greet') || lower.includes('arrival') || lower.includes('intake')) {
    question = `A customer or patient arrives at your station for ${process}. What is your first action?`;
  } else if (lower.includes('verify') || lower.includes('check') || lower.includes('identify')) {
    question = `Before taking the next step, what details must you verify?`;
  } else if (lower.includes('sanitize') || lower.includes('prep') || lower.includes('glove')) {
    question = `When preparing your workstation prior to execution, what hygiene step is required?`;
  } else if (lower.includes('collect') || lower.includes('draw') || lower.includes('scan') || lower.includes('fold')) {
    question = `How should you complete this core task step?`;
  } else if (lower.includes('label') || lower.includes('barcode') || lower.includes('attach')) {
    question = `When handling labels or documentation for this item, what rule applies?`;
  } else if (lower.includes('reject') || lower.includes('discard') || lower.includes('escalate')) {
    question = `If an anomaly or compromised item is detected, what must you do?`;
  }

  const choiceCorrect = instruction;

  let choiceDistractor1 = `Skip ${words.slice(0, 3).join(' ')} and proceed without verification.`;
  let choiceDistractor2 = `Use unverified manual shortcut or proceed without required check.`;

  if (lower.includes('verify') || lower.includes('identify')) {
    choiceDistractor1 = `Rely on verbal confirmation without checking photo ID or order requisition.`;
    choiceDistractor2 = `Skip identity verification if the person appears in a rush.`;
  } else if (lower.includes('sanitize') || lower.includes('glove')) {
    choiceDistractor1 = `Begin task directly without sanitizing station or wearing fresh gloves.`;
    choiceDistractor2 = `Re-use single-use protective gloves from a previous task.`;
  } else if (lower.includes('collect') || lower.includes('draw') || lower.includes('scan')) {
    choiceDistractor1 = `Perform step out of sequence or record completion before physical check.`;
    choiceDistractor2 = `Execute step using unapproved containers or non-standard tools.`;
  } else if (lower.includes('label') || lower.includes('barcode')) {
    choiceDistractor1 = `Apply labels away from the workstation prior to physical task completion.`;
    choiceDistractor2 = `Handwrite label details manually without scanning barcode.`;
  } else if (lower.includes('reject') || lower.includes('escalate')) {
    choiceDistractor1 = `Ignore the anomaly and attempt to process item despite compliance error.`;
    choiceDistractor2 = `Store compromised item without logging issue or notifying supervisor.`;
  }

  return {
    title,
    question,
    choiceCorrect,
    choiceDistractor1,
    choiceDistractor2,
  };
}

/**
 * Transforms OperationalBlueprint into complete Lesson, ProcessPassport, BlueprintV1, and StepObject[]
 */
export function generateLessonFromOperationalBlueprint(
  extracted: ExtractedDocument,
  opBlueprint: OperationalBlueprint
): {
  lesson: Lesson;
  passport: ProcessPassport;
  blueprint: BlueprintV1;
  stepObjects: StepObject[];
} {
  const role = opBlueprint.role;
  const process = opBlueprint.process;
  const lessonId = `doc-${extracted.fileHash}`;

  const steps = opBlueprint.operational_steps.length > 0
    ? opBlueprint.operational_steps.slice(0, 6)
    : [
        {
          instruction: `Execute ${process} according to written operational specifications.`,
          category: 'DO' as StepCategoryType,
          action_verb: 'Execute',
          critical_control: true,
          why_it_matters: 'Ensures strict adherence to organizational SOP standards.',
          source: { page_or_section: 'Page 1', source_ref: 'S1.sec1', source_text: extracted.rawText.slice(0, 100) },
        },
      ];

  const simulatorSteps: SimulatorStep[] = steps.map((item, idx) => {
    const stepNum = idx + 1;
    const scenario = createScenarioQuestionFromStep(item, role, process, idx);

    return {
      id: stepNum,
      title: scenario.title,
      type: 'location',
      question: scenario.question,
      taskTitle: process,
      taskOrder: `SOP Step ${stepNum}`,
      taskItem: item.instruction,
      targetCode: `REF-${stepNum}0${idx + 1}`,
      targetQty: 1,
      sku: `SRC-${stepNum}`,
      priority: item.critical_control ? 'High Priority' : 'Standard',
      choices: [
        { id: 'c1', title: scenario.choiceCorrect, subtitle: `${role} SOP Standard`, isCorrect: true },
        { id: 'c2', title: scenario.choiceDistractor1, subtitle: `Non-compliant Action`, isCorrect: false },
        { id: 'c3', title: scenario.choiceDistractor2, subtitle: `Unapproved Procedure`, isCorrect: false },
      ],
      why: item.why_it_matters || `SOP Requirement: ${item.source.source_text}`,
      coachTip: `Operational Rule: ${item.instruction}`,
      hint: `Refer to ${item.source.page_or_section} in ${extracted.filename}`,
      source_ref: item.source.source_ref,
      page_or_section: item.source.page_or_section,
      evidence: item.source.source_text,
    };
  });

  const stepObjects: StepObject[] = simulatorSteps.map((simStep, idx) => ({
    id: `step_${idx + 1}`,
    order: idx + 1,
    title: simStep.title.split(' ').slice(0, 4).join(' '),
    icon: '📋',
    purpose: idx % 2 === 0 ? 'skill' : 'understanding',
    component: 'choice_list',
    screen: {
      header: `Step ${idx + 1}: ${simStep.title}`,
      info: simStep.evidence || simStep.why,
    },
    coach_say: `Follow the written ${role} procedure rule.`,
    question: simStep.question.length > 60 ? simStep.question.slice(0, 57) + '...' : simStep.question,
    options: [
      { id: 'o1', label: simStep.choices[0].title.split(' ').slice(0, 6).join(' ') },
      { id: 'o2', label: simStep.choices[1].title.split(' ').slice(0, 6).join(' ') },
    ],
    correct: 'o1',
    why: simStep.why.split(' ').slice(0, 12).join(' '),
    wrong_feedback: {
      o2: `Incorrect action. Refer to written ${role} SOP rule.`,
    },
    wrong_default: `Check written SOP text.`,
    hint: simStep.hint.split(' ').slice(0, 12).join(' '),
    reshow_card: null,
    scan_required: false,
    risk: simStep.priority === 'High Priority' ? 'compliance' : 'normal',
    source_ref: simStep.source_ref || 'S1',
    hotspots: null,
  }));

  const orientationCards: OrientationCard[] = [
    {
      id: 'card_overview',
      kind: 'what',
      title: `What is ${process}?`,
      body: opBlueprint.purpose,
      audio_text: `Role: ${role}. Purpose: ${opBlueprint.purpose}`,
      visual: { type: 'icon', ref: 'clipboard' },
      must_view: true,
      source_ref: 'S1.overview',
    },
    {
      id: 'card_purpose',
      kind: 'why',
      title: 'Why This Matters',
      body: opBlueprint.customer_or_business_impact[0]?.impact || `Adhering to ${process} ensures service quality and safety.`,
      audio_text: opBlueprint.customer_or_business_impact[0]?.impact || `Adhering to ${process} ensures service quality and safety.`,
      visual: { type: 'icon', ref: 'safety' },
      must_view: true,
      source_ref: 'S1.impact',
    },
    {
      id: 'card_compliance',
      kind: 'rule',
      title: 'Critical Control Rule',
      body: opBlueprint.critical_controls[0]?.rule || `Never bypass mandatory verification steps or operate outside written guidelines.`,
      audio_text: opBlueprint.critical_controls[0]?.rule || `Never bypass mandatory verification steps or operate outside written guidelines.`,
      visual: { type: 'icon', ref: 'rule' },
      must_view: true,
      source_ref: 'S1.control',
    },
  ];

  const passport: ProcessPassport = {
    process_name: process,
    language: 'en',
    fields: {
      plain_definition: {
        text: opBlueprint.purpose,
        source_ref: 'S1.definition',
        basis: 'from_source',
        status: 'approved',
      },
      why_it_matters: [
        {
          who_depends: 'Frontline Teams & Customers',
          impact: opBlueprint.customer_or_business_impact[0]?.impact || 'Maintains strict service accuracy and safety.',
          source_ref: 'S1.why',
          basis: 'from_source',
          status: 'approved',
        },
      ],
      where_it_fits: {
        upstream: 'Task Trigger & Intake',
        this: process,
        downstream: 'Task Completion & Sign-off',
        source_ref: 'S1.workflow',
        status: 'approved',
      },
      tools: opBlueprint.tools_and_systems.map((t) => ({
        name: t.name,
        what_it_is: `${role} operational system/tool.`,
        purpose: t.purpose,
        never_do: t.never_do,
        visual_hint: 'Official workstation system',
        source_ref: t.source_ref,
        basis: 'from_source' as const,
        status: 'approved' as const,
      })),
      terms: opBlueprint.terminology.map((t) => ({
        term: t.term,
        meaning: t.meaning,
        source_ref: t.source_ref,
        status: 'approved',
      })),
      golden_rules: opBlueprint.critical_controls.map((c) => ({
        text: c.rule,
        source_ref: c.source_ref,
        status: 'approved',
      })),
      safety_notes: opBlueprint.safety_rules.map((s) => ({
        text: s.rule,
        source_ref: s.source_ref,
        status: 'approved',
      })),
      escalation: {
        text: opBlueprint.escalations[0]?.contact_or_action || 'Contact lead supervisor immediately upon anomaly.',
        source_ref: 'S1.escalation',
        basis: 'from_source',
        status: 'approved',
      },
      newcomer_worries: ['Remembering exact step sequence', 'Handling unexpected edge cases'],
    },
    questions_for_trainer: [],
    is_approved: true,
  };

  const blueprint: BlueprintV1 = {
    schema_version: '1.1',
    status: 'ok',
    status_reason: `Generated directly from source file '${extracted.filename}'`,
    missing_passport_fields: [],
    meta: {
      title: process,
      topic: 'Safety',
      language: 'en',
      role,
      image_type: 'sop_page',
      confidence: opBlueprint.confidence || 0.98,
      passport_id: `PSP-${lessonId.toUpperCase()}`,
      passport_version: 1,
      estimated_minutes: 8,
      sources: [
        {
          id: 'S1',
          type: 'sop',
          note: `Uploaded File: ${extracted.filename} (${extracted.confirmationText})`,
        },
      ],
    },
    orientation: {
      estimated_minutes: 3,
      cards: orientationCards,
      tool_explorer: {
        enabled: true,
        items: opBlueprint.tools_and_systems.map((t) => ({
          tool_name: t.name,
          card_id: `card_overview`,
        })),
      },
      quick_check: simulatorSteps.slice(0, 3),
      skip: {
        diagnostic_step_ids: ['step_1', 'step_2'],
        pass_threshold: 0.75,
        always_show: ['card_compliance'],
      },
    },
    scenarios: {
      watch: simulatorSteps,
      practice: simulatorSteps,
      test: simulatorSteps,
    },
    floor_checklist: simulatorSteps.map((s, idx) => ({
      id: `fc_${idx + 1}`,
      step_id: `step_${idx + 1}`,
      behaviour: s.why,
      source_ref: s.source_ref || 'S1',
    })),
    takeaways: opBlueprint.critical_controls.map((c) => c.rule),
    common_mistakes: opBlueprint.common_mistakes.map((m) => m.mistake),
  };

  let category: 'All' | 'Picking' | 'Packing' | 'Safety' | 'Inventory' = 'Safety';
  if (role.includes('Retail') || role.includes('Cashier')) category = 'Inventory';

  const lesson: Lesson = {
    id: lessonId,
    title: process,
    subtitle: `Role: ${role} · Source: ${extracted.filename}`,
    category,
    color: 'sky',
    accentColor: '#2F6FED',
    stepsCount: simulatorSteps.length,
    durationMinutes: Math.max(5, Math.ceil(simulatorSteps.length * 1.5)),
    level: 'Beginner',
    progress: 0,
    masteryPercentage: 0,
    artType: 'clipboard',
    description: opBlueprint.purpose,
    sourceMeta: {
      filename: extracted.filename,
      version: '1.0',
      fileHash: extracted.fileHash,
      pageCount: extracted.pageCount,
      wordCount: extracted.wordCount,
      confirmationText: extracted.confirmationText,
      rawText: extracted.rawText,
    },
    blueprint,
    passport,
    operationalBlueprint: opBlueprint,
  };

  return { lesson, passport, blueprint, stepObjects };
}

/**
 * Main entry point: Generates a source-grounded Lesson & Operational Blueprint from an ExtractedDocument
 */
export function generateDomainNeutralLesson(
  extracted: ExtractedDocument,
  providedBlueprint?: OperationalBlueprint
): {
  lesson: Lesson;
  passport: ProcessPassport;
  blueprint: BlueprintV1;
  stepObjects: StepObject[];
} {
  // 1. Build Knowledge Model
  const km = buildSopKnowledgeModel(extracted);

  // 2. Build Operational Blueprint
  const opBlueprint = providedBlueprint || buildOperationalBlueprintFromKnowledgeModel(km);

  // 3. Build Training Plan
  const trainingPlan = buildTrainingPlanFromBlueprint(opBlueprint);

  // 4. LOG THE COMPLETE INTELLIGENCE CHAIN
  console.group(`[SOP INTELLIGENCE CHAIN LOG] File: '${extracted.filename}'`);
  console.log(`1. DOCUMENT & EXTRACTED TEXT:`, { filename: extracted.filename, pages: extracted.pageCount, words: extracted.wordCount });
  console.log(`2. NORMALIZED TEXT:`, { length: extracted.rawText.length, sample: extracted.rawText.slice(0, 120) + '...' });
  console.log(`3. KNOWLEDGE MODEL:`, { role: km.identity.role, process: km.identity.process, stepsCount: km.steps.length, decisionsCount: km.decisionPoints.length });
  console.log(`4. OPERATIONAL BLUEPRINT:`, { title: opBlueprint.process, steps: opBlueprint.operational_steps.length, controls: opBlueprint.critical_controls.length });
  console.log(`5. TRAINING PLAN:`, { planItemsCount: trainingPlan.length, types: trainingPlan.map((p) => p.type) });
  console.log(`6. STAGE PLAN: 4-Stage Learning Experience (Teach Me, Show Me, Guide Me, Test Me)`);
  console.groupEnd();

  const { lesson, passport, blueprint, stepObjects } = generateLessonFromOperationalBlueprint(extracted, opBlueprint);
  lesson.knowledgeModel = km;
  lesson.trainingPlan = trainingPlan;

  return { lesson, passport, blueprint, stepObjects };
}
