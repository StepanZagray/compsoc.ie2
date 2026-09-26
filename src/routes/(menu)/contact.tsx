import { createFileRoute } from "@tanstack/react-router"
import {
	Check,
	Copy,
	ExternalLink,
	Mail,
	MapPin,
	UserPlus,
} from "lucide-react"
import {
	type ComponentType,
	type ReactNode,
	useCallback,
	useRef,
	useState,
} from "react"
import { DiscordIcon } from "#/components/icons/DiscordIcon"
import { InstagramIcon } from "#/components/icons/InstagramIcon"
import { buttonVariants } from "#/components/ui/button"
import { PageTitle } from "#/components/ui/page-title"
import { Panel } from "#/components/ui/panel"
import { PageLayout } from "#/layouts"
import { seo } from "#/lib/seo"
import { cn } from "#/lib/utils"

export const Route = createFileRoute("/(menu)/contact")({
	component: ContactPage,
	head: () =>
		seo({
			title: "Contact | CompSoc",
			description:
				"Get in touch with CompSoc, the University of Galway Computer Society, by email, Discord or Instagram, or find us on campus.",
			path: "/contact",
		}),
})

const EMAIL = "compsoc@socs.universityofgalway.ie"

type Channel = {
	name: string
	detail: ReactNode
	Icon: ComponentType<{ className?: string }>
} /** Opens in a new tab. */ & (
	| { href: string; copy?: never }
	/** Copies this text on click. */
	| { copy: string; href?: never }
)

/** Every way to reach us, one row each in the contact window. */
const CHANNELS: ReadonlyArray<Channel> = [
	{
		name: "Email",
		// Line breaks only between the address's parts, never mid-word;
		// a size down on phones, where its longest part is just too wide.
		detail: (
			<span className="max-sm:text-xs">
				compsoc@
				<wbr />
				socs.
				<wbr />
				universityofgalway.ie
			</span>
		),
		copy: EMAIL,
		Icon: Mail,
	},
	{
		name: "Instagram",
		detail: "@compsocgalway",
		href: "https://instagram.com/compsocgalway/",
		Icon: InstagramIcon,
	},
	{
		name: "Discord",
		detail: "discord.compsoc.ie",
		href: "https://discord.compsoc.ie/",
		Icon: DiscordIcon,
	},
	{
		name: "Join on YourSpace",
		detail:
			"Become a member to access events, services, and our community.",
		href: "https://socs.universityofgalway.ie/societies/compsoc",
		Icon: UserPlus,
	},
]

function ContactPage() {
	return (
		<PageLayout>
			<PageTitle
				title="Get in touch"
				subtitle="Connect with our community, attend events, and become part of CompSoc."
			/>

			<Panel>
				<div className="border-border border-b-2 p-6">
					<h2 className="heading-2 flex items-center gap-2 text-foreground">
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
							"gap-2",
						)}
					>
						View on Maps
						<ExternalLink className="size-4" />
					</a>
				</div>
			</Panel>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Panel className="flex flex-col">
					<div className="border-border border-b-2 p-6">
						<h2 className="heading-2 flex items-center gap-2 text-foreground">
							<Mail className="size-5 text-accent" />
							Contact & social
						</h2>
					</div>
					{/* One row per way to reach us. Beside the tall Instagram
					    window (lg) the rows share the window's height, so it fills
					    with its own content; stacked, they keep their own. */}
					<ul className="grid flex-1 list-none gap-3 p-6 lg:auto-rows-fr">
						{CHANNELS.map((channel) => (
							<li key={channel.name}>
								<ChannelRow channel={channel} />
							</li>
						))}
					</ul>
				</Panel>

				<Panel>
					<div className="border-border border-b-2 p-6">
						<h2 className="heading-2 flex items-center gap-2 text-foreground">
							<InstagramIcon className="size-5 text-accent" />
							Latest on Instagram
						</h2>
					</div>
					{/* Edge to edge under the header. The embed is Instagram's
					    fixed layout: a header, a 3-column grid of two rows, then a
					    "View full profile" footer. The frame is sized to all of it
					    (2/3 of its width plus ~196px, ~223px from 480px wide) so it
					    never scrolls, and this box crops it where the grid ends
					    (~147px / ~157px + 2/3 width, measured), so the window ends
					    on the photos. The embed's header links to the profile. */}
					<div className="@container">
						<div className="@min-[480px]:h-[calc(157px+66.667cqw)] h-[calc(147px+66.667cqw)] overflow-hidden">
							<iframe
								title="CompSoc Galway on Instagram"
								src="https://www.instagram.com/compsocgalway/embed/"
								className="block @min-[480px]:h-[calc(225px+66.667cqw)] h-[calc(198px+66.667cqw)] w-full border-0"
								loading="lazy"
								allow="clipboard-write; encrypted-media; picture-in-picture"
								referrerPolicy="strict-origin-when-cross-origin"
							/>
						</div>
					</div>
				</Panel>
			</div>
		</PageLayout>
	)
}

const rowClass =
	"flex h-full w-full cursor-pointer items-center gap-2.5 rounded-md border-2 border-border p-3 text-left outline-none transition-colors hover:border-border-secondary focus-visible:border-border-secondary sm:gap-4 sm:p-4"

/**
 * One way to reach us: icon, what it is, the account or address, and what a
 * click does (open, or copy). A control inside a window, so on hover its
 * border lightens like a button's; the accent is kept for focused windows.
 */
function ChannelRow({ channel }: { channel: Channel }) {
	const { name, detail, Icon } = channel
	const [copied, setCopied] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(null)

	const copy = useCallback((text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		if (timer.current) clearTimeout(timer.current)
		timer.current = setTimeout(() => setCopied(false), 2000)
	}, [])

	const body = (action: ReactNode) => (
		<>
			<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-accent sm:size-12">
				<Icon className="size-5" />
			</span>
			<span className="min-w-0 flex-1">
				<span className="heading-3 block text-foreground">
					{name}
				</span>
				<span className="block text-muted-foreground text-sm [overflow-wrap:anywhere]">
					{detail}
				</span>
			</span>
			<span
				className="shrink-0 text-muted-foreground"
				aria-hidden
			>
				{action}
			</span>
		</>
	)

	const { copy: text } = channel
	if (text !== undefined) {
		return (
			<button
				type="button"
				onClick={() => copy(text)}
				className={rowClass}
			>
				{body(
					copied ? (
						<Check className="size-4 text-foreground" />
					) : (
						<Copy className="size-4" />
					),
				)}
				<span className="sr-only" aria-live="polite">
					{copied
						? `${name} address copied`
						: `Copy ${name} address`}
				</span>
			</button>
		)
	}

	return (
		<a
			href={channel.href}
			target="_blank"
			rel="noopener noreferrer"
			className={rowClass}
		>
			{body(<ExternalLink className="size-4" />)}
		</a>
	)
}
