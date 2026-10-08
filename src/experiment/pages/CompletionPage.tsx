import React from 'react';
import { Slide } from '../types';
import { Text, Pill, Panel, SopHeader } from '../tokens';

export const CompletionPage: React.FC<{
  slide: Slide;
  onNext: () => void;
}> = ({ slide }) => {
  const nextTitle = slide.next || 'Next mode: guide me';
  const nextSubtitle = slide.nb || 'Practise the steps with live coach guidance beside you.';

  return (
    <div className="flex flex-col gap-4">
      {/* Universal SOP Header */}
      <SopHeader tag="Module complete" title={slide.title || 'Theory mastery achieved'} />

      {/* 3. Lead */}
      <Text styleName="body">
        {slide.content || "You've reviewed the operational logic. Ready for interactive floor practice?"}
      </Text>

      {/* 4. Content block: Next action recommendation Panel */}
      <Panel type="default" className="flex flex-col gap-2">
        <Text styleName="panel-heading">{nextTitle}</Text>
        <Text styleName="body">{nextSubtitle}</Text>
      </Panel>
    </div>
  );
};
