import { DomainCard } from "../components/shared/DomainCard"

export const Domains = () => {
  const domains = [
    {
      title: "IPR & Patents",
      image: "/img/categories/1.png",
      points: ["Patents filed/published/granted", "Copyrights", "Trademarks"],
    },
    {
      title: "Journal Publications",
      image: "/img/categories/2.png",
      points: ["Journal articles", "Scopus/WoS indexed", "Faculty & scholar entries"],
    },
    // add remaining cards same way
  ]

  return (
    <section id="domains" className="py-20 px-20">
      <div className="container mx-auto px-6 space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Domain / Category</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((d, i) => (
            <DomainCard key={i} {...d} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Domains