import { Link } from "react-router-dom"
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  MessageCircle,
} from "lucide-react"
import Logo from "./Logo"
import { cn } from "@/components/shadcn/utils"

interface FooterProps {
  className?: string
}

const FooterContent = ({ className }: FooterProps) => {
  const developers = [
    { name: "Lakshya Chopra", role: "Lead Developer", github: "#", linkedin: "#" },
    { name: "Riya", role: "Frontend Engineer", github: "#", linkedin: "#" },
    { name: "Harshit Suthar", role: "UI/UX Designer", github: "#", linkedin: "#" },
  ]

  const spsuSocials = [
    { icon: <Facebook size={16} />, href: "https://www.facebook.com/spsuofficial" },
    { icon: <Instagram size={16} />, href: "https://www.instagram.com/spsuofficial/" },
    { icon: <Linkedin size={16} />, href: "https://www.linkedin.com/school/spsuofficial/posts/?feedView=all" },
    { icon: <Youtube size={16} />, href: "https://www.youtube.com/channel/UC8obPl4D4BCLGEmu9ynvw0Q/featured" },
    { icon: <Phone size={16} />, href: "tel:+9118008896555" },
    { icon: <MessageCircle size={16} />, href: "https://api.whatsapp.com/send?phone=919509627697" },
  ]

  return (
    <footer
      className={cn(
        "w-full bg-neutral-800 text-white border-t border-neutral-700",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">

          {/* LEFT SIDE */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">

            <Link to="#hero" className="hover:opacity-90 transition">
              <Logo logoWidth={220} mode="dark" />
            </Link>

            {/* SOCIAL ICONS */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {spsuSocials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    p-2.5 rounded-full 
                    bg-neutral-700 
                    border border-neutral-600/40
                    hover:bg-neutral-600
                    transition-all duration-300
                  "
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white">
                Faculty of Computer Science and Informatics (FCI)
              </p>
              <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                © {new Date().getFullYear()}, Sir Padampat Singhania University, Udaipur.
                All Rights Reserved.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Project Contributors
            </span>

            <div className="flex flex-col gap-5">
              {developers.map((dev, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center md:justify-end gap-4"
                >
                  <div className="text-center md:text-right">
                    <p className="text-sm font-semibold text-white">
                      {dev.name}
                    </p>
                    <p className="text-xs tracking-wider text-white/70">
                      {dev.role}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        p-2 rounded-lg 
                        bg-neutral-700 
                        border border-neutral-600/40
                        hover:bg-neutral-600
                        transition-all duration-300
                      "
                    >
                      <Github size={14} />
                    </a>
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        p-2 rounded-lg 
                        bg-neutral-700 
                        border border-neutral-600/40
                        hover:bg-neutral-600
                        transition-all duration-300
                      "
                    >
                      <Linkedin size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default FooterContent