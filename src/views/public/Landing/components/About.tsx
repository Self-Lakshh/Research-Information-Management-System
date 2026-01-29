export const About = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/images/rims-devices.png"
          className="rounded-2xl shadow-lg"
        />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">About RIMS</h2>
          <p className="text-muted-foreground leading-relaxed">
            RIMS is a dedicated portal consolidating all research-related
            information from the SPSU academic community...
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Through RIMS, the institution ensures transparency, data integrity,
            optimization of research-related data...
          </p>
        </div>
      </div>
    </section>
  )
}

export default About