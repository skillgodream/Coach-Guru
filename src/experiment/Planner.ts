import { Lesson } from '../types';
import { TeachMePlan, Slide } from './types';

export function planSlides(lesson: Lesson): TeachMePlan {
  const slides: Slide[] = [];

  // Check if this is the Housekeeping lesson or general SOP
  const isHousekeeping =
    lesson.id === 'housekeeping_sanitization' ||
    lesson.title.toLowerCase().includes('housekeeping') ||
    lesson.title.toLowerCase().includes('sanitization');

  if (isHousekeeping) {
    // 1. WELCOME
    slides.push({
      type: 'WELCOME',
      tag: 'Teach Me',
      title: 'Housekeeping Room Sanitization',
      role: 'Role: Housekeeping Attendant',
      content:
        'Ensure a safe, welcoming environment for every guest through our 5-step sanitization protocol.',
      cta: "Let's Begin",
    });

    // 2. OBJECTIVES
    slides.push({
      type: 'OBJECTIVES',
      title: 'What You Will Learn',
      lead: 'By the end of this lesson, you will be able to:',
      items: [
        'Prepare sanitizer to the correct dilution ratio',
        'Sanitize high-touch surfaces effectively',
        'Handle visible debris and dirt correctly',
      ],
      content:
        'Prepare sanitizer to the correct dilution ratio\nSanitize high-touch surfaces effectively\nHandle visible debris and dirt correctly',
    });

    // 3. SECTION INTRO
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

    // 4. TEACH STEP 1
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

    // 5. IMPORTANT RULE
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

    // 6. TEACH STEP 2
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

    // 7. DO / DON'T
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

    // 8. REAL-WORLD SCENARIO
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

    // 10. KEY TAKEAWAYS
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
    // Dynamic fallback for any other SOP
    slides.push({
      type: 'WELCOME',
      tag: 'Teach Me',
      title: lesson.title,
      role: `Role: ${lesson.title} Operator`,
      content: lesson.description || 'Welcome to operational training.',
      cta: "Let's Begin",
    });

    slides.push({
      type: 'OBJECTIVES',
      title: 'What You Will Learn',
      lead: 'By the end of this lesson, you will be able to:',
      items: [
        'Identify key tools and safety prerequisites',
        'Execute standard operating steps accurately',
        'Handle non-standard situations and exceptions',
      ],
      content:
        'Identify key tools and safety prerequisites\nExecute standard operating steps accurately\nHandle non-standard situations and exceptions',
    });

    slides.push({
      type: 'SECTION_INTRO',
      sec: 'Section 1 of 2',
      title: `Starting ${lesson.title}`,
      content: 'Follow the core procedure to ensure quality and compliance.',
      fl: ['Personal safety ready', 'Tools verified', 'Checklist open'],
    });

    slides.push({
      type: 'TEACH_STEP',
      step: 'Step 1 of 1',
      title: 'Execute Core Protocol',
      ic: 'room',
      items: [
        'Verify required input criteria',
        'Follow standard process flow',
        'Inspect final quality outcome',
      ],
      content: 'Follow standard process flow and verify required criteria.',
    });

    slides.push({
      type: 'IMPORTANT_RULE',
      title: 'Adhere strictly to verified process limits.',
      why: 'Compliance and safety requirements must never be bypassed.',
      ic: 'warn',
      slash: 1,
      content: 'Adhere strictly to verified process limits.',
    });

    slides.push({
      type: 'DO_DONT',
      title: 'Do and Don’t',
      content: 'Essential operational boundaries.',
      dos: ['Follow verified procedure steps', 'Ask lead trainer on uncertainty'],
      donts: ['Skip verification checks', 'Bypass safety rules'],
      comparison: {
        do: ['Follow verified procedure steps', 'Ask lead trainer on uncertainty'],
        dont: ['Skip verification checks', 'Bypass safety rules'],
      },
    });

    slides.push({
      type: 'REAL_WORLD_SCENARIO',
      title: 'Handling Operational Deviation',
      content: 'An unexpected condition is encountered during standard execution.',
      ic: 'wipe',
    });

    slides.push({
      type: 'DECISION',
      title: 'What is the correct protocol move?',
      content: 'What is the correct protocol move?',
      opts: [
        { t: 'Ignore and proceed anyway', why: 'Never ignore deviations. Try again.' },
        { t: 'Halt and perform verification check', ok: 1, why: 'Correct. Safety and compliance come first.' },
      ],
      choices: [
        { id: 'wrong', text: 'Ignore and proceed anyway', isCorrect: false, feedback: 'Never ignore deviations. Try again.', why: 'Never ignore deviations.' },
        { id: 'right', text: 'Halt and perform verification check', isCorrect: true, feedback: 'Correct. Safety and compliance come first.', why: 'Correct.' },
      ],
    });

    slides.push({
      type: 'KEY_TAKEAWAYS',
      title: 'Key Takeaways',
      items: [
        'Complete all pre-checks before operating',
        'Follow instructions in sequence',
        'Report anomalies immediately',
      ],
      content:
        'Complete all pre-checks before operating\nFollow instructions in sequence\nReport anomalies immediately',
    });

    slides.push({
      type: 'COMPLETION',
      title: 'Great Job!',
      content: 'You’ve completed this section.',
      next: 'Next: Guide Me',
      nb: 'Practise the steps with a coach beside you.',
    });
  }

  return { lessonId: lesson.id, title: lesson.title, slides };
}
