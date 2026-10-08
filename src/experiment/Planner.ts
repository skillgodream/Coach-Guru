import { Lesson } from '../types';
import { TeachMePlan, Slide } from './types';
import { findBestVisualMatch } from '../utils/visualLibraryMatcher';

export function getDomainHeroImage(title: string, role: string): {
  hero: string;
  checklist: Array<{ title: string; subtitle: string; img: string; status: 'check' | 'prohibited' }>;
} {
  const combined = `${title} ${role}`.toLowerCase();

  if (combined.includes('housekeeping') || combined.includes('sanitization') || combined.includes('cleaning')) {
    return {
      hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      checklist: [
        {
          title: 'Dilute Sanitizer (1:10 ratio)',
          subtitle: 'Measure chemical accurately into blue applicator bottle.',
          img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=300&q=80',
          status: 'check',
        },
        {
          title: 'Microfibre Cloths Ready',
          subtitle: 'Color-coded microfibre cloths for surface sanitization.',
          img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=300&q=80',
          status: 'check',
        },
        {
          title: 'Never Spray Directly Over Dirt',
          subtitle: 'Wipe visible debris before applying disinfectant spray.',
          img: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=300&q=80',
          status: 'prohibited',
        },
      ],
    };
  }

  if (combined.includes('patient') || combined.includes('blood') || combined.includes('lab') || combined.includes('phlebotomy') || combined.includes('medical') || combined.includes('healthcare')) {
    return {
      hero: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      checklist: [
        {
          title: 'Name & DOB Matching',
          subtitle: 'Verify patient wristband against test order form.',
          img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
          status: 'check',
        },
        {
          title: 'Specimen Tube Barcode',
          subtitle: 'Scan and verify barcode label before sample collection.',
          img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80',
          status: 'check',
        },
        {
          title: 'Never Draw Unverified Patient',
          subtitle: 'Do not proceed if wristband name or DOB does not match.',
          img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80',
          status: 'prohibited',
        },
      ],
    };
  }

  if (
    combined.includes('warehouse') ||
    combined.includes('inventory') ||
    combined.includes('picker') ||
    combined.includes('picking') ||
    combined.includes('outbound') ||
    combined.includes('inbound') ||
    combined.includes('fulfilment') ||
    combined.includes('fulfillment') ||
    combined.includes('commerce') ||
    combined.includes('dispatch') ||
    combined.includes('order') ||
    combined.includes('tote') ||
    combined.includes('logistics')
  ) {
    return {
      hero: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      checklist: [
        {
          title: 'Scan Tote Barcode',
          subtitle: 'Match pick tote location code with handheld terminal.',
          img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=300&q=80',
          status: 'check',
        },
        {
          title: 'Verify Item Expiry Date',
          subtitle: 'Check FIFO batch date before placing in cold container.',
          img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80',
          status: 'check',
        },
        {
          title: 'Never Ship Damaged Seals',
          subtitle: 'Reject punctured or leaking packages immediately.',
          img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=300&q=80',
          status: 'prohibited',
        },
      ],
    };
  }

  return {
    hero: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    checklist: [
      {
        title: 'Workstation Verification',
        subtitle: 'Ensure safety equipment and tools are calibrated.',
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
        status: 'check',
      },
      {
        title: 'Order & ID Matching',
        subtitle: 'Verify work order numbers against physical items.',
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
        status: 'check',
      },
      {
        title: 'Bypass Prohibited',
        subtitle: 'Never skip mandatory safety and identity verifications.',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        status: 'prohibited',
      },
    ],
  };
}

export function planSlides(lesson: Lesson): TeachMePlan {
  const slides: Slide[] = [];

  // Check if this is the Housekeeping lesson or general SOP
  const isHousekeeping =
    lesson.id === 'housekeeping_sanitization' ||
    lesson.title.toLowerCase().includes('housekeeping') ||
    lesson.title.toLowerCase().includes('sanitization');

  if (isHousekeeping) {
    // 1. WELCOME (ORIENT)
    slides.push({
      type: 'WELCOME',
      tag: 'Teach Me',
      title: 'Housekeeping Room Sanitization',
      role: 'Role: Housekeeping Attendant',
      content:
        'Ensure a safe, welcoming environment for every guest through our 5-step sanitization protocol.',
      cta: "Let's Begin",
    });

    // 2. OBJECTIVES (ORIENT)
    slides.push({
      type: 'OBJECTIVES',
      title: 'What You Will Learn',
      lead: 'By the end of this section, you will be able to:',
      items: [
        'Prepare sanitizer to the correct dilution ratio',
        'Sanitize high-touch surfaces effectively',
        'Handle visible debris and dirt correctly',
      ],
      content:
        'Prepare sanitizer to the correct dilution ratio\nSanitize high-touch surfaces effectively\nHandle visible debris and dirt correctly',
    });

    // 3. SECTION INTRO (PREPARE)
    slides.push({
      type: 'SECTION_INTRO',
      sec: 'Section 1 of 3',
      title: 'Before You Sanitize',
      content:
        'Get your tools and supplies ready for a safe and effective clean.',
      fl: [
        'Gloves on',
        'Sanitizer 1:10',
        'Blue applicator bottle',
        'Microfibre cloths',
        'Trolley stocked',
      ],
    });

    // 4. TEACH STEP 1 (PERFORM)
    slides.push({
      type: 'TEACH_STEP',
      step: 'Step 1 of 2',
      title: 'Prepare Sanitizer',
      ic: 'bottle',
      items: [
        'Dilute the surface sanitizer using a 1:10 ratio',
        'Use the blue applicator bottle',
        'Label the bottle with today’s date',
      ],
      content: 'Dilute the surface sanitizer using a 1:10 ratio in the blue applicator bottle.',
      evidenceSource: 'Step 1 of 2',
    });

    // 5. IMPORTANT RULE (CONTROL)
    slides.push({
      type: 'IMPORTANT_RULE',
      title:
        'Improper dilution fails to neutralize viral pathogens effectively.',
      why: 'Safety and efficacy. Always measure. Never guess the ratio.',
      ic: 'warn',
      slash: 1,
      content:
        'Improper dilution fails to neutralize viral pathogens effectively.',
      gurujiCoaching: {
        explanation: 'Improper dilution fails to neutralize viral pathogens effectively.',
        whyItMatters: 'Safety and efficacy. Always measure. Never guess the ratio.',
        nextMove: 'Proceed to spray high-touch surfaces.',
      },
    });

    // 6. TEACH STEP 2 (PERFORM)
    slides.push({
      type: 'TEACH_STEP',
      step: 'Step 2 of 2',
      title: 'Spray High-Touch Areas',
      ic: 'spray',
      items: [
        'Light switches',
        'Door handles',
        'Remote controls',
      ],
      content: 'Spray all high-touch areas: light switches, handles, and remote controls.',
      evidenceSource: 'Step 2 of 2',
    });

    // 7. DO / DON'T (CONTROL)
    slides.push({
      type: 'DO_DONT',
      title: 'Do and Don’t',
      content: 'Proper sanitization practices vs hazardous mistakes.',
      dos: [
        'Wipe visible dirt with a damp cloth',
        'Spray all high-touch surfaces',
      ],
      donts: [
        'Spray sanitizer directly over dirt',
        'Miss high-touch areas like remotes',
      ],
      comparison: {
        do: [
          'Wipe visible dirt with a damp cloth',
          'Spray all high-touch surfaces',
        ],
        dont: [
          'Spray sanitizer directly over dirt',
          'Miss high-touch areas like remotes',
        ],
      },
    });

    // 8. REAL-WORLD SCENARIO (DECIDE / HANDLE)
    slides.push({
      type: 'REAL_WORLD_SCENARIO',
      title: 'Dust on the Surface',
      content:
        'You are about to spray a surface and notice visible dust and debris.',
      ic: 'wipe',
      evidenceSource: 'SOP Exception Handling',
    });

    // 9. DECISION
    slides.push({
      type: 'DECISION',
      title: 'How do you handle the visible debris?',
      content: 'How do you handle the visible debris?',
      opts: [
        {
          t: 'Spray sanitizer directly over the dirt',
          why: 'Dirt blocks the sanitizer, so germs survive. Try again.',
        },
        {
          t: 'Wipe dirt with a damp microfibre cloth first',
          ok: 1,
          why: 'Right. Clean first, then sanitize.',
        },
      ],
      choices: [
        {
          id: 'wrong',
          text: 'Spray sanitizer directly over the dirt',
          isCorrect: false,
          feedback: 'Dirt blocks the sanitizer, so germs survive. Try again.',
          why: 'Dirt blocks the sanitizer, so germs survive. Try again.',
        },
        {
          id: 'right',
          text: 'Wipe dirt with a damp microfibre cloth first',
          isCorrect: true,
          feedback: 'Right. Clean first, then sanitize.',
          why: 'Right. Clean first, then sanitize.',
        },
      ],
    });

    // 10. KEY TAKEAWAYS (PROVE)
    slides.push({
      type: 'KEY_TAKEAWAYS',
      title: 'Key Takeaways',
      items: [
        'Dilute sanitizer 1:10 in the blue bottle',
        'Wipe visible dirt before you spray',
        'Spray every high-touch area',
        'Never spray over dirt',
        'Check remotes, switches and handles',
      ],
      content:
        'Dilute sanitizer 1:10 in the blue bottle\nWipe visible dirt before you spray\nSpray every high-touch area\nNever spray over dirt\nCheck remotes, switches and handles',
    });

    // 11. COMPLETION
    slides.push({
      type: 'COMPLETION',
      title: 'Great Job!',
      content: 'You’ve completed this section.',
      next: 'Next: Guide Me',
      nb: 'Practise the steps with a coach beside you.',
    });
  } else {
    // ------------------------------------------------------------------------
    // 8-STAGE UNIVERSAL SOP TRAINING FLOW FRAMEWORK
    // ------------------------------------------------------------------------
    const opBlueprint = lesson.operationalBlueprint;
    const blueprint = lesson.blueprint;
    const km = lesson.knowledgeModel;
    const passport = lesson.passport;

    const role = opBlueprint?.role || km?.identity?.role || passport?.process_name || 'Frontline Specialist';
    const processName = opBlueprint?.process || km?.identity?.process || lesson.title;
    const purpose = opBlueprint?.purpose || km?.purpose || lesson.description;
    const opSteps = opBlueprint?.operational_steps || [];

    // Lock Domain Image Assets & Direction
    const domainAssets = getDomainHeroImage(processName, role);

    // ========================================================================
    // STAGE 1: ORIENT (Role & Expected Outcomes)
    // ========================================================================
    // Cover Page (Welcome)
    slides.push({
      type: 'WELCOME',
      tag: 'Teach Me',
      title: processName,
      role: `Role: ${role}`,
      content: purpose || 'Welcome to operational training.',
      cta: "Let's Begin",
    });

    // Expected Outcomes ("What You Will Learn")
    let objectivesItems: string[] = [];
    if (opSteps.length > 0) {
      objectivesItems = opSteps.slice(0, 4).map((s) => {
        const title = s.task_title || s.instruction;
        if (s.action_verb && !title.toLowerCase().startsWith(s.action_verb.toLowerCase())) {
          return `${s.action_verb} - ${title}`;
        }
        return title;
      });
    } else if (km?.steps?.length) {
      objectivesItems = km.steps.slice(0, 4).map((s) => s.action);
    } else if (blueprint?.floor_checklist?.length) {
      objectivesItems = blueprint.floor_checklist.slice(0, 4).map((fc) => fc.behaviour);
    } else {
      objectivesItems = [
        `Understand the core operational workflow for ${processName}`,
        `Verify all required tools, inputs, and prerequisites`,
        `Execute sequential process steps in compliance with written SOP`,
        `Identify non-standard exceptions and execute escalation boundaries`,
      ];
    }

    slides.push({
      type: 'OBJECTIVES',
      title: 'What You Will Learn',
      lead: 'By the end of this section, you will be able to:',
      items: objectivesItems,
      content: objectivesItems.join('\n'),
    });

    // ========================================================================
    // STAGE 2: PREPARE (Prerequisites & Tool Setup)
    // ========================================================================
    let prepChecklist: string[] = [];
    if (opBlueprint?.prerequisites?.length) {
      prepChecklist = opBlueprint.prerequisites.slice(0, 5).map((p) => p.text);
    } else if (opBlueprint?.tools_and_systems?.length) {
      prepChecklist = opBlueprint.tools_and_systems.slice(0, 5).map((t) => `${t.name} verified`);
    } else if (passport?.fields?.tools?.length) {
      prepChecklist = passport.fields.tools.slice(0, 5).map((t) => `${t.name} verified`);
    } else if (km?.prerequisites?.length) {
      prepChecklist = km.prerequisites.slice(0, 5).map((p) => p.text);
    } else {
      prepChecklist = [
        `${processName} order verified`,
        'Workstation & tools ready',
        'Pre-execution safety checks cleared',
      ];
    }

    const prepareTitle = `Before You Execute ${processName}`;
    const prepareContent = purpose || `Confirm all prerequisites, tools, and readiness checks before starting ${processName}.`;

    slides.push({
      type: 'SECTION_INTRO',
      sec: 'Stage 2: Prepare',
      title: prepareTitle,
      content: prepareContent,
      fl: prepChecklist,
      img: domainAssets.hero,
    });

    // ========================================================================
    // STAGE 3: PERFORM (Sequential Step Protocol)
    // ========================================================================
    if (opSteps.length > 0) {
      const chunkSize = Math.max(2, Math.ceil(opSteps.length / 2));
      for (let i = 0; i < opSteps.length; i += chunkSize) {
        const stepChunk = opSteps.slice(i, i + chunkSize);
        const stepNum = Math.floor(i / chunkSize) + 1;
        const totalStepsSlides = Math.ceil(opSteps.length / chunkSize);

        const firstAction = stepChunk[0];
        const stepTitle = firstAction.task_title || (firstAction.action_verb ? `${firstAction.action_verb} Protocol` : firstAction.instruction);

        slides.push({
          type: 'TEACH_STEP',
          step: `Step ${stepNum} of ${totalStepsSlides}`,
          title: stepTitle,
          ic: firstAction.action_verb || 'check',
          items: stepChunk.map((s) => s.instruction),
          content: stepChunk.map((s) => s.instruction).join('\n'),
          evidenceSource: firstAction.source?.page_or_section || `SOP Section ${stepNum}`,
          img: domainAssets.checklist[i % domainAssets.checklist.length]?.img,
        });
      }
    } else if (km?.steps?.length) {
      slides.push({
        type: 'TEACH_STEP',
        step: 'Step 1 of 1',
        title: 'Core Process Protocol',
        ic: 'check',
        items: km.steps.slice(0, 4).map((s) => s.action),
        content: km.steps.slice(0, 4).map((s) => s.action).join('\n'),
        evidenceSource: km.steps[0]?.sourceRef || 'SOP Section 1',
        img: domainAssets.checklist[0]?.img,
      });
    } else {
      slides.push({
        type: 'TEACH_STEP',
        step: 'Step 1 of 1',
        title: 'Execute Core Protocol',
        ic: 'check',
        items: [
          `Verify ${processName} work order parameters`,
          'Inspect inputs, tools, and environmental conditions',
          'Execute operational process steps according to written SOP',
          'Validate output quality and log completion status',
        ],
        content: 'Follow standard verification protocol and complete registration.',
        img: domainAssets.checklist[0]?.img,
      });
    }

    // ========================================================================
    // STAGE 4: CONTROL (Quality Limits & Critical Rules)
    // ========================================================================
    // Critical Rule / Safety Boundary Card
    const criticalControl =
      opBlueprint?.critical_controls?.[0] ||
      (opBlueprint?.safety_rules?.[0] ? { rule: opBlueprint.safety_rules[0].rule, rationale: 'Safety and compliance requirement.' } : null) ||
      (passport?.fields?.golden_rules?.[0] ? { rule: passport.fields.golden_rules[0].text, rationale: 'Core operational compliance.' } : null) ||
      (km?.criticalControls?.[0] ? { rule: km.criticalControls[0], rationale: km.whyItMatters || 'Essential process control.' } : null) || {
        rule: `Never proceed with unverified parameters or bypassed safety checks during ${processName}.`,
        rationale: `Skipping mandatory verifications compromises operational quality and violates compliance. Escalate anomalies to your supervisor.`,
      };

    slides.push({
      type: 'IMPORTANT_RULE',
      title: criticalControl.rule,
      why: criticalControl.rationale || 'Compliance and operational safety requirements must never be bypassed.',
      ic: 'warn',
      slash: 1,
      content: criticalControl.rule,
      img: domainAssets.checklist[2]?.img,
      gurujiCoaching: {
        explanation: criticalControl.rule,
        whyItMatters: criticalControl.rationale || 'Essential process control.',
        nextMove: 'Escalate to your supervisor immediately.',
      },
    });

    // Do & Don't Side-by-Side Comparison
    let dos: string[] = [];
    let donts: string[] = [];

    if (opBlueprint?.common_mistakes?.length) {
      dos = opBlueprint.common_mistakes.slice(0, 2).map((m) => m.prevention || `Verify order parameters before starting ${processName}`);
      donts = opBlueprint.common_mistakes.slice(0, 2).map((m) => m.mistake || `Execute ${processName} without verifying required criteria`);
    } else if (km?.commonMistakes?.length) {
      donts = km.commonMistakes.slice(0, 2);
      dos = [`Verify order parameters before starting ${processName}`, 'Validate output quality against SOP standard'];
    } else if (passport?.fields?.golden_rules?.length) {
      dos = passport.fields.golden_rules.slice(0, 2).map((g) => g.text);
      donts = [`Bypass pre-execution safety or identity verifications in ${processName}`, 'Assume parameters are correct without checking'];
    } else {
      dos = [
        `Verify work order parameters and item details before execution`,
        `Validate output quality and confirm parameters match ${processName} SOP`,
      ];
      donts = [
        `Bypass pre-execution safety or identity verifications in ${processName}`,
        `Proceed with execution when parameters or item details do not match`,
      ];
    }

    slides.push({
      type: 'DO_DONT',
      title: 'Do and Don’t',
      content: 'Essential operational boundaries for quality and compliance.',
      dos,
      donts,
      comparison: { do: dos, dont: donts },
    });

    // ========================================================================
    // STAGE 5: DECIDE & STAGE 6: HANDLE & STAGE 7: ESCALATE (Frontline Judgment)
    // ========================================================================
    const scenarioStep =
      opSteps.find((s) => s.scenario_question && s.choices && s.choices.length > 0) ||
      (opBlueprint?.exceptions?.[0]
        ? {
            scenario_question: `Parameter Mismatch: ${opBlueprint.exceptions[0].trigger}`,
            choices: [
              { id: 'wrong_1', title: 'Proceed anyway and ignore the parameter mismatch', isCorrect: false, subtitle: 'High operational risk: causes process failure or quality defect' },
              { id: 'right', title: 'Halt execution, confirm details with supervisor, and follow exception protocol', isCorrect: true, subtitle: 'Standard compliant SOP exception protocol' },
              { id: 'wrong_2', title: 'Bypass verification check and fix records later', isCorrect: false, subtitle: 'Violates mandatory compliance protocol' },
            ],
          }
        : null) ||
      (opBlueprint?.decision_points?.[0]
        ? {
            scenario_question: opBlueprint.decision_points[0].situation,
            choices: [
              { id: 'wrong_1', title: 'Proceed without verification', isCorrect: false, subtitle: 'Risk of operational discrepancy' },
              { id: 'right', title: opBlueprint.decision_points[0].action || opBlueprint.decision_points[0].decision, isCorrect: true, subtitle: 'Standard SOP verification' },
              { id: 'wrong_2', title: 'Bypass check and report later', isCorrect: false, subtitle: 'Violates SOP protocol' },
            ],
          }
        : null) ||
      (km?.decisionPoints?.[0]
        ? {
            scenario_question: km.decisionPoints[0].situation,
            choices: km.decisionPoints[0].options.map((opt, i) => ({
              id: opt === km.decisionPoints[0].correctDecision ? 'right' : `wrong_${i}`,
              title: opt,
              isCorrect: opt === km.decisionPoints[0].correctDecision,
              subtitle: opt === km.decisionPoints[0].correctDecision ? 'Compliant protocol' : 'Non-compliant action',
            })),
          }
        : null);

    if (scenarioStep) {
      slides.push({
        type: 'REAL_WORLD_SCENARIO',
        title: scenarioStep.scenario_question || 'Operational Decision Required',
        content: scenarioStep.scenario_question || `An operational anomaly or parameter mismatch occurs during ${processName}. What is the compliant SOP action?`,
        ic: 'wipe',
        evidenceSource: 'SOP Exception & Escalation Protocol',
        img: domainAssets.hero,
      });

      const opts = (scenarioStep.choices || []).map((c) => ({
        t: c.title,
        ok: c.isCorrect ? 1 : 0,
        why: c.isCorrect
          ? `Correct. Follow standard SOP exception protocol for ${processName} and escalate if unresolved.`
          : `Incorrect. Never proceed when parameters or safety criteria do not match ${processName} SOP.`,
      }));

      const choices = (scenarioStep.choices || []).map((c) => ({
        id: c.id || (c.isCorrect ? 'right' : 'wrong_' + Math.random().toString(36).substring(2, 5)),
        text: c.title,
        isCorrect: c.isCorrect,
        feedback: c.isCorrect
          ? `Correct. Follow standard SOP exception protocol for ${processName} and escalate to your supervisor if unresolved.`
          : `Incorrect. Never execute ${processName} when required criteria or inputs fail verification.`,
        why: c.isCorrect
          ? `Correct. Follow standard SOP exception protocol for ${processName} and escalate to your supervisor if unresolved.`
          : `Incorrect. Never execute ${processName} when required criteria or inputs fail verification.`,
      }));

      slides.push({
        type: 'DECISION',
        title: 'What should you do?',
        content: scenarioStep.scenario_question || 'What should you do?',
        opts,
        choices,
        img: domainAssets.hero,
      });
    }

    // ========================================================================
    // STAGE 8: PROVE (Recall & Retention Check)
    // ========================================================================
    let takeaways: string[] = [];
    if (opBlueprint?.critical_controls?.length) {
      takeaways.push(...opBlueprint.critical_controls.map((c) => c.rule));
    }
    if (opBlueprint?.escalations?.length) {
      takeaways.push(...opBlueprint.escalations.map((e) => `Escalate: ${e.situation}`));
    }
    if (blueprint?.takeaways?.length) {
      takeaways.push(...blueprint.takeaways);
    }
    if (opSteps.length) {
      takeaways.push(...opSteps.map((s) => s.instruction));
    }
    if (km?.criticalControls?.length) {
      takeaways.push(...km.criticalControls);
    }

    const uniqueTakeaways = Array.from(new Set(takeaways))
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5);

    const fallbackTakeaways = [
      `Verify order parameters and inputs before starting ${processName}`,
      `Never proceed with unverified criteria or bypassed safety checks`,
      `Follow standard sequential steps according to written SOP`,
      `Validate output quality before finalizing completion`,
      `Halt execution and escalate anomalies you cannot resolve`,
    ];

    const finalTakeaways = uniqueTakeaways.length > 0 ? uniqueTakeaways : fallbackTakeaways;

    slides.push({
      type: 'KEY_TAKEAWAYS',
      title: 'Key Takeaways',
      items: finalTakeaways,
      content: finalTakeaways.join('\n'),
    });

    // Completion / Transition to Practice (Guide Me)
    slides.push({
      type: 'COMPLETION',
      title: 'Great Job!',
      content: 'You’ve completed the operational overview for this section.',
      next: 'Next: Guide Me',
      nb: 'Practise the steps with a coach beside you.',
    });
  }

  // Dynamic Post-Processing Pass: Enrich slide images from the Guruji Real Photo Visual Library
  for (const slide of slides) {
    const supportsImage = ['WELCOME', 'SECTION_INTRO', 'TEACH_STEP', 'IMPORTANT_RULE', 'REAL_WORLD_SCENARIO', 'DECISION'].includes(slide.type);
    
    if (supportsImage) {
      const slideText = `${slide.title || ''} ${slide.content || ''} ${slide.items?.join(' ') || ''} ${slide.step || ''} ${slide.lead || ''}`;
      const lessonContext = `${lesson.title} ${lesson.category || ''} ${lesson.description || ''}`;
      const { url } = findBestVisualMatch(slideText, lessonContext);
      if (url) {
        slide.img = url;
        slide.alt = slide.title || 'Visual illustration';
      }
    }
  }

  return { lessonId: lesson.id, title: lesson.title, slides };
}
