export const About = () => {
  return (
    <section id="about" className="py-20 px-10">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/img/others/mockup.png"
          className="rounded-2xl shadow-lg"
        />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">About RIMS</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            RIMS is a dedicated portal consolidating all research-related
            information from the SPSU academic community. Supporting
            documentation, transparency, and data-driven insights forThe
            Research Information Management System (RIMS) serves as a
            centralized digital platform to document, manage, and showcase the
            scholarly, research, and innovation activities of the institution.
            It reflects the academic excellence, research productivity, and
            societal contributions of faculty members, researchers, and
            scholars.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Through RIMS, the institution ensures transparency, accessibility,
            and systematic organization of all research-related data,
            supporting accreditation, rankings, collaborations, and strategic
            decision-making. institutional excellence.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About