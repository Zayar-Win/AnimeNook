import BlogLayout from "@/Layouts/BlogLayout";
import React from "react";

const About = () => {
    return (
        <div>
            <div>
                <div className="xl:px-16 lg:px-[50px] px-[20px] py-10">
                    <h1 className="text-4xl font-bold">About AnimeNook</h1>
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Our Story
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Welcome to AnimeNook, your ultimate destination
                                for all things anime! Founded in 2023, we're
                                passionate about bringing the vibrant world of
                                anime to enthusiasts worldwide. Our platform
                                serves as a hub where anime lovers can discover,
                                discuss, and celebrate their favorite series and
                                characters.
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                What started as a small blog has grown into a
                                thriving community of dedicated anime fans. We
                                pride ourselves on providing high-quality
                                content, insightful reviews, and creating a
                                space where fellow anime enthusiasts can connect
                                and share their passion.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Our Mission
                            </h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-600 leading-relaxed">
                                    At AnimeNook, our mission is to:
                                </p>
                                <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
                                    <li>
                                        Create engaging content for anime
                                        enthusiasts
                                    </li>
                                    <li>
                                        Build a welcoming community for fans
                                        worldwide
                                    </li>
                                    <li>
                                        Provide honest and detailed anime
                                        reviews
                                    </li>
                                    <li>
                                        Share the latest news and updates from
                                        the anime world
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Why Choose Us?
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800">
                                        Expert Reviews
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2">
                                        Our team of experienced anime
                                        enthusiasts provides in-depth, unbiased
                                        reviews of the latest releases.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800">
                                        Active Community
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2">
                                        Join thousands of anime fans in
                                        discussions, sharing recommendations,
                                        and participating in events.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800">
                                        Regular Updates
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2">
                                        Stay informed with our daily updates on
                                        the latest anime news, releases, and
                                        industry trends.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

About.layout = (page) => <BlogLayout>{page}</BlogLayout>;
