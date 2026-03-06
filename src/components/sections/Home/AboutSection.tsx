import { Link } from "@tanstack/react-router";

const AboutSection = () => {
	return (
		<section className="relative flex w-full flex-col items-center px-4 py-8 md:px-6 md:py-12">
			<div className="z-10 flex w-full max-w-4xl flex-col gap-8 md:gap-12">
				<h1 className="mb-2 text-center font-extrabold text-3xl text-secondary-foreground tracking-wide sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl">
					About us
					<span className="mx-auto mt-2 block h-1 w-16 rounded-full bg-secondary sm:w-20 md:mt-3 md:w-24" />
				</h1>
				<div className="flex flex-col gap-8 md:gap-12">
					<div className="flex flex-col gap-2 md:gap-3">
						<h2 className="relative mb-1 text-left font-bold text-secondary-foreground text-xl sm:text-2xl">
							Who we are
							<span className="mx-0 mt-2 block h-0.5 w-12 rounded-full bg-secondary sm:w-13" />
						</h2>
						<p className="font-normal text-base text-muted-foreground leading-7 tracking-wide sm:leading-relaxed">
							CompSoc is University of Galway's Computer and
							Networking Society. We host events for
							everything computing related from how to setup
							your own blog to System Administration and
							Programming Tutorials. We also host a number
							of services on our Society run servers for our
							members. CompSoc is the oldest
							computer-related society in Ireland, while
							many Alumni believe it was much earlier, was
							formally established in 1977 during the days
							that the University was known as UCG.
						</p>
					</div>
					<div className="flex flex-col gap-2 md:gap-3">
						<h2 className="relative mb-1 text-left font-bold text-secondary-foreground text-xl sm:text-2xl">
							Our mission
							<span className="mx-0 mt-2 block h-0.5 w-10 rounded-full bg-secondary sm:w-11" />
						</h2>
						<p className="font-normal text-base text-muted-foreground leading-7 tracking-wide sm:leading-relaxed">
							CompSoc's main goal is to try and foster a
							love and passion for all things technology
							related in University of Galway. We host a
							wide variety of events to work towards this
							goal, including workshops about Linux,
							hardware and programming. As outlined under
							our Constitution, our aims is to "promote and
							increase awareness of electronic communication
							and related computer systems, a forum to
							discuss and gain experience in computer
							networking and systems and to help educate
							people in the usage of Internet utilities and
							resources".
						</p>
					</div>
					<div className="flex flex-col gap-2 md:gap-3">
						<h2 className="relative mb-1 text-left font-bold text-secondary-foreground text-xl sm:text-2xl">
							Our constitution
							<span className="mx-0 mt-2 block h-0.5 w-10 rounded-full bg-secondary sm:w-11" />
						</h2>
						<p className="font-normal text-base text-muted-foreground leading-7 tracking-wide sm:leading-relaxed">
							You can find our constitution{" "}
							<b>
								<Link
									className="text-accent underline"
									to="/constitution"
								>
									here
								</Link>
							</b>
							, as ratified by the USCG (
							<i>
								"University Societies Coordination Group"
							</i>
							) on 27th May, 2022.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
