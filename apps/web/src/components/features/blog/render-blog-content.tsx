/** Renders seed/blog body: blank-line paragraphs + ## headings. */
export function renderBlogContent(content: string) {
  const blocks = content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith('## ')) {
      return (
        <h2
          key={index}
          className="mt-8 font-[family-name:var(--font-montserrat)] text-xl font-bold text-neutral-900"
        >
          {block.replace(/^##\s+/, '')}
        </h2>
      );
    }
    return (
      <p key={index} className="mt-4 leading-relaxed text-neutral-700">
        {block}
      </p>
    );
  });
}
