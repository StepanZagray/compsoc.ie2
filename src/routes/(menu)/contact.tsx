import { createFileRoute } from "@tanstack/react-router"
import { ExternalLink, Mail, MapPin } from "lucide-react"
import { useEffect } from "react"
import { InstagramIcon } from "#/components/icons/InstagramIcon"
import { XIcon } from "#/components/icons/XIcon"
import {
	PageLayout,
	PageTitle,
	Panel,
} from "#/components/PageLayout"
import { buttonVariants } from "#/components/ui/button"
import { cn } from "#/lib/utils"

export const Route = createFileRoute("/(menu)/contact")({
	component: ContactPage,
})

function ContactPage() {
	useEffect(() => {
		const script = document.createElement("script")
		script.src = "https://platform.twitter.com/widgets.js"
		script.async = true
		const twitterEmbed = document.querySelector(
			".twitter-embed",
		)
		if (twitterEmbed) {
			twitterEmbed.appendChild(script)
		}
	}, [])

	return (
		<PageLayout>
			<PageTitle
				title="Get in touch"
				subtitle="Connect with our community, attend events, and become part of CompSoc."
			/>

			<Panel className="mb-8">
				<div className="border-border border-b-2 p-6">
					<h2 className="flex items-center gap-2 font-semibold text-foreground">
						<MapPin className="size-5 text-accent" />
						Our location
					</h2>
					<p className="mt-1 text-muted-foreground text-sm">
						Áras na Mac Léinn, University of Galway
					</p>
				</div>
				<div className="w-full">
					<iframe
						title="Our location"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1192.8049748746676!2d-9.060928941645427!3d53.27860804875015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485b96f199468d6b%3A0x38d894c0eee8ab25!2sNUI%20Galway%20Computer%20Society!5e0!3m2!1sen!2sie!4v1600623742256!5m2!1sen!2sie"
						className="h-64 w-full md:h-80"
						style={{ border: 0 }}
						allowFullScreen
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
				<div className="border-border border-t-2 p-6">
					<a
						href="https://maps.google.com/?q=University+of+Galway"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							buttonVariants({
								variant: "outline",
								size: "sm",
							}),
							"inline-flex items-center gap-2",
						)}
					>
						View on Maps
						<ExternalLink className="size-4" />
					</a>
				</div>
			</Panel>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<Panel>
					<div className="border-border border-b-2 p-6">
						<h2 className="flex items-center gap-2 font-semibold text-foreground">
							<Mail className="size-5 text-accent" />
							Contact & social
						</h2>
						<p className="mt-1 text-muted-foreground text-sm">
							Get in touch via email or follow us on social
							media.
						</p>
					</div>
					<div className="space-y-6 p-6">
						<div>
							<h3 className="font-medium text-foreground">
								Email us
							</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								Send us an email and we&apos;ll get back to
								you as soon as possible.
							</p>
							<a
								href="mailto:compsoc@socs.universityofgalway.ie"
								className={cn(
									buttonVariants({
										variant: "outline",
										size: "sm",
									}),
									"mt-2 inline-flex items-center gap-2",
								)}
							>
								compsoc@socs.universityofgalway.ie
								<ExternalLink className="size-4" />
							</a>
						</div>
						<div>
							<h3 className="font-medium text-foreground">
								Follow us
							</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								Stay updated with news and announcements.
							</p>
							<div className="mt-3 flex gap-2">
								<a
									href="https://x.com/UGCompsoc"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="X (Twitter)"
									className={cn(
										buttonVariants({
											variant: "outline",
											size: "sm",
										}),
									)}
								>
									<XIcon className="size-4" />
								</a>
								<a
									href="https://instagram.com/compsocgalway/"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Instagram"
									className={cn(
										buttonVariants({
											variant: "outline",
											size: "sm",
										}),
									)}
								>
									<InstagramIcon className="size-4" />
								</a>
							</div>
						</div>
					</div>
				</Panel>

				<Panel>
					<div className="border-border border-b-2 p-6">
						<h2 className="flex items-center gap-2 font-semibold text-foreground">
							<XIcon className="size-5 text-accent" />
							Latest updates
						</h2>
						<p className="mt-1 text-muted-foreground text-sm">
							Follow us on X for the latest news.
						</p>
					</div>
					<div className="flex min-h-[280px] items-center justify-center p-6">
						<div className="twitter-embed w-full">
							<a
								title="Latest updates"
								className="twitter-timeline"
								data-theme="dark"
								data-tweet-limit="3"
								data-chrome="noheader nofooter noborders transparent"
								href="https://x.com/UGCompSoc"
								aria-label="View latest updates from CompSoc Galway on X"
							>
								Latest updates
							</a>
						</div>
					</div>
				</Panel>
			</div>
		</PageLayout>
	)
}
