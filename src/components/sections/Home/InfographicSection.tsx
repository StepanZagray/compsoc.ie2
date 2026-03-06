import {
	CalendarDays,
	Database,
	UserRoundCog,
	UsersRound,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
} from "#/components/ui/card";
import { NumberOfCommitteeMembers } from "#/services/committee";

const InfographicSection = () => {
	return (
		<section className="flex w-full flex-col items-center px-4 pb-8 md:px-6">
			<div className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
				{/* Years established */}
				<Card className="group flex flex-col items-center px-2 py-6 text-center md:px-4 md:py-8">
					<CardHeader className="flex flex-col items-center p-0 pb-2">
						<div className="relative mb-2 md:mb-3">
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
							<span className="relative inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-2 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 md:p-3">
								<CalendarDays
									size={28}
									className="text-primary md:h-9 md:w-9"
								/>
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col items-center p-0">
						<h2 className="mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text font-extrabold text-2xl text-transparent transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 sm:text-3xl md:text-4xl">
							{new Date().getFullYear() - 1977}
						</h2>
						<p className="font-normal text-sm tracking-wide">
							<strong>years</strong> established
						</p>
					</CardContent>
				</Card>
				{/* Members */}
				<Card className="group flex flex-col items-center px-2 py-6 text-center md:px-4 md:py-8">
					<CardHeader className="flex flex-col items-center p-0 pb-2">
						<div className="relative mb-2 md:mb-3">
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
							<span className="relative inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-2 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 md:p-3">
								<UsersRound
									size={28}
									className="text-primary md:h-9 md:w-9"
								/>
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col items-center p-0">
						<h2 className="mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text font-extrabold text-2xl text-transparent transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 sm:text-3xl md:text-4xl">
							1,388
						</h2>
						<p className="font-normal text-sm tracking-wide">
							<strong>members</strong> and growing
						</p>
					</CardContent>
				</Card>
				{/* Committee members */}
				<Card className="group flex flex-col items-center px-2 py-6 text-center md:px-4 md:py-8">
					<CardHeader className="flex flex-col items-center p-0 pb-2">
						<div className="relative mb-2 md:mb-3">
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
							<span className="relative inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-2 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 md:p-3">
								<UserRoundCog
									size={28}
									className="text-primary md:h-9 md:w-9"
								/>
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col items-center p-0">
						<h2 className="mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text font-extrabold text-2xl text-transparent transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 sm:text-3xl md:text-4xl">
							{NumberOfCommitteeMembers}
						</h2>
						<p className="font-normal text-sm tracking-wide">
							<strong>committee</strong> members
						</p>
					</CardContent>
				</Card>
				{/* Server space */}
				<Card className="group flex flex-col items-center px-2 py-6 text-center md:px-4 md:py-8">
					<CardHeader className="flex flex-col items-center p-0 pb-2">
						<div className="relative mb-2 md:mb-3">
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
							<span className="relative inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-2 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 md:p-3">
								<Database
									size={28}
									className="text-primary md:h-9 md:w-9"
								/>
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col items-center p-0">
						<h2 className="mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text font-extrabold text-2xl text-transparent transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 sm:text-3xl md:text-4xl">
							5
						</h2>
						<p className="font-normal text-sm tracking-wide">
							<strong>GB</strong> free server space
						</p>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default InfographicSection;
