import './StoryTag.css';

function StoryTag({ label, ghost = false }) {
  return (
    <span className={`story-tag${ghost ? ' story-tag--ghost' : ''}`}>
      {label}
    </span>
  );
}

export default StoryTag;
