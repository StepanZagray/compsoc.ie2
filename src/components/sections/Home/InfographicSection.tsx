import { Trophy } from "lucide-react"
import { useEffect, useRef } from "react"
import { CountUp } from "#/components/ui/count-up"
import { sectionStyle } from "#/constants/section-variants"
import { useActiveSection } from "#/contexts/active-section"
import { useWindowEnter } from "#/hooks/useWindowEnter"
import { NumberOfCommitteeMembers } from "#/services/committee-size"

type SectionMotionProps = {
	activeVariant: { borderColor: string; opacity: number }
	inactiveVariant: { borderColor: string; opacity: number }
	transition: {
		duration: number
		ease: [number, number, number, number]
	}
}

const metrics = [
	{
		value: __BUILD_YEAR__ - 1977,
		label: "years since 1977",
	},
	{ value: 1388, label: "members" },
	{
		value: Number(NumberOfCommitteeMembers),
		label: "on the committee",
	},
	{
		value: __EVENT_STATS__.total,
		label: `events since ${__EVENT_STATS__.since}`,
	},
]

const InfographicSection = ({
	activeVariant,
	inactiveVariant,
	transition,
}: SectionMotionProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const {
		activeSectionId,
		registerSection,
		setTapOverride,
	} = useActiveSection()
	const active = activeSectionId === "stats"

	useEffect(
		() => registerSection("stats", sectionRef),
		[registerSection],
	)
	useWindowEnter(sectionRef)

	return (
		<section
			ref={sectionRef}
			className="scroll-window flex w-full flex-col items-center px-4 pb-4"
			onTouchEnd={() => setTapOverride("stats")}
		>
			<div
				className="flex w-full flex-col overflow-hidden rounded-md border-2 bg-background/80 p-4 shadow-lg md:p-6"
				style={sectionStyle(
					active,
					activeVariant,
					inactiveVariant,
					transition,
				)}
			>
				<p className="text-sm md:text-base">
					<span className="text-accent">~ ❯</span> compsoc
					--stats
				</p>

				<div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
					{/* The award leads: it's the society's most recent national recognition. */}
					<div>
						{/* The trophy tile is the height of the two title lines
						    beside it (48px). */}
						<div className="flex items-center gap-4">
							<div className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-amber-300/40 bg-amber-300/10">
								<Trophy
									className="size-6 text-amber-300"
									aria-hidden
								/>
							</div>
							<div>
								<p className="text-amber-300 text-sm">
									BICS National Awards 2025
								</p>
								<h2 className="heading-2 text-foreground">
									Best Intervarsity
								</h2>
							</div>
						</div>
						<p className="mt-3 text-muted-foreground text-sm leading-6">
							Awarded for the Capture the Flag intervarsity
							we hosted: a hacking competition between
							college teams, with every challenge written by
							our committee.
						</p>
					</div>

					{/* Each figure hangs off a rule, like a column of `df` output:
					    the number carries the weight, the label stays quiet. */}
					<dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:gap-x-4">
						{metrics.map(({ value, label }) => (
							<div
								key={label}
								className="flex flex-col border-border border-l-2 pl-4"
							>
								<dd className="font-extrabold text-4xl text-foreground tracking-tight lg:text-5xl">
									<CountUp value={value} />
								</dd>
								<dt className="mt-2 text-muted-foreground text-sm">
									{label}
								</dt>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	)
}

export default InfographicSection
