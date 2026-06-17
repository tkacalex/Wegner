type LegalSection = { heading: string; body: string };

type Props = {
  title: string;
  intro?: string;
  todo: string;
  sections: LegalSection[];
};

export function LegalContent({ title, intro, todo, sections }: Props) {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="mx-auto max-w-prose">
          <h1 className="heading-lg text-brand-black">{title}</h1>
          {intro && <p className="lead mt-4">{intro}</p>}

          <div className="mt-6 rounded-xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-ink">
            {todo}
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-lg font-semibold text-brand-black">{s.heading}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-brand-gray">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
