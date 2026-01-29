import { PartnerCard } from "../components/shared/PartnerCard"

export const Partners = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 space-y-12 text-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Our Partner Portal</h2>
          <p className="text-muted-foreground">
            Building bridges across academia, industry, and government
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <PartnerCard logo="/logos/spu-irins.png" name="SPU IRINS" description="Faculty profile & research visibility portal." />
          <PartnerCard logo="/logos/spu-ebc.png" name="SPU EBC" description="Research funding and consultancy database." />
          <PartnerCard logo="/logos/dl-net.png" name="DELNET" description="Access to global research libraries and networks." />
        </div>
      </div>
    </section>
  )
}

export default Partners