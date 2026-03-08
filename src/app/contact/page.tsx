import { EnquiryForm } from "@/components/sections/enquiry-form";
import { JsonLd } from "@/components/ui/json-ld";
import { getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildLocalBusinessSchema } from "@/lib/seo/schema";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export async function generateMetadata() {
	return buildMetadata({
		title: "Contact Us",
		description: "Contact Jayco Industrial Manufacturing for project enquiries, support, and quote requests.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const settings = await getSiteSettings();

	return (
		<main className="bg-stone-50 min-h-screen">
			<JsonLd data={buildLocalBusinessSchema(settings)} />

			{/* Hero Section */}
			<section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-stone-900 border-b-8 border-orange-600">
				{/* Dramatic Background Element */}
				<div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
					<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-500 to-transparent rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3" />
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl">
						<span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
							Get In Touch
						</span>
						<h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-6">
							Contact Us
						</h1>
						<p className="text-lg md:text-xl text-stone-300 leading-relaxed max-w-2xl font-medium">
							Whether you need a custom quote, technical support, or have a general enquiry about our manufacturing capabilities, our team is ready to assist.
						</p>
					</div>
				</div>
			</section>

			{/* Main Content Area */}
			<section className="py-16 lg:py-24">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
						
						{/* Left Pane - Contact Details */}
						<div className="lg:col-span-5 space-y-10">
							<div>
								<h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-8">
									Direct Contact
								</h3>
								
								<div className="space-y-8">
									{/* Phones */}
									{settings.phones.length > 0 && (
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
												<Phone className="w-6 h-6 text-orange-600" />
											</div>
											<div>
												<p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Call Us</p>
												{settings.phones.map((phone) => (
													<a 
														key={phone} 
														href={`tel:${phone.replace(/[^+\d]/g, "")}`}
														className="block text-lg font-bold text-stone-900 hover:text-orange-600 transition-colors"
													>
														{phone}
													</a>
												))}
											</div>
										</div>
									)}

									{/* Emails */}
									{settings.emails.length > 0 && (
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
												<Mail className="w-6 h-6 text-orange-600" />
											</div>
											<div>
												<p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Email Us</p>
												{settings.emails.map((email) => (
													<a 
														key={email} 
														href={`mailto:${email}`}
														className="block text-lg font-bold text-stone-900 hover:text-orange-600 transition-colors"
													>
														{email}
													</a>
												))}
											</div>
										</div>
									)}

									{/* Address */}
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
											<MapPin className="w-6 h-6 text-orange-600" />
										</div>
										<div>
											<p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Headquarters</p>
											<p className="text-lg font-bold text-stone-900 leading-snug max-w-[250px]">
												{settings.address}
											</p>
										</div>
									</div>

									{/* Hours */}
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
											<Clock className="w-6 h-6 text-orange-600" />
										</div>
										<div>
											<p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Operating Hours</p>
											<p className="text-lg font-bold text-stone-900">Mon - Fri, 8:00am - 5:00pm</p>
											<p className="text-stone-500 font-medium">Closed Weekends & Public Holidays</p>
										</div>
									</div>
								</div>
							</div>

							{/* Stylized Map Placeholder */}
							<div className="relative h-[300px] w-full bg-stone-200 rounded-2xl overflow-hidden ring-1 ring-stone-200/50">
								<div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Chicago,IL&zoom=11&size=600x400&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x707070&style=feature:landscape|element:geometry.fill|color:0xececec&style=feature:poi|element:geometry.fill|color:0xd3d3d3&style=feature:road|element:geometry.fill|color:0xffffff&style=feature:transit|element:geometry.fill|color:0xececec&style=feature:water|element:geometry.fill|color:0xd9d9d9')] bg-cover bg-center grayscale opacity-80" />
								<div className="absolute inset-0 bg-stone-900/10" />
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
									<div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transform -translate-y-4">
										<MapPin className="w-6 h-6" />
									</div>
									<div className="w-4 h-4 bg-orange-600/30 rounded-full mx-auto blur-sm"></div>
								</div>
							</div>
						</div>

						{/* Right Pane - Form */}
						<div className="lg:col-span-7">
							<div className="-mt-32 lg:-mt-48 relative z-20">
								<EnquiryForm sourcePath="/contact" title="Start Your Enquiry" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
