import BlogLayout from "@/Layouts/BlogLayout";
import React from "react";

const PrivacyAndPolicy = () => {
    return (
        <div>
            <div>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-700 mb-4">
                            When you visit AnimeNook, we may collect certain
                            information about your device, browsing actions, and
                            patterns. This includes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                            <li>
                                Log data (IP address, browser type, pages
                                visited)
                            </li>
                            <li>Device information</li>
                            <li>Cookies and usage data</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We use the collected information for various
                            purposes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                            <li>To provide and maintain our service</li>
                            <li>To notify you about changes to our website</li>
                            <li>To provide customer support</li>
                            <li>
                                To gather analysis or valuable information to
                                improve our services
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            3. Data Security
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We implement appropriate security measures to
                            protect your personal information. However, no
                            method of transmission over the Internet is 100%
                            secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            4. Third-Party Links
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Our website may contain links to other sites. We are
                            not responsible for the privacy practices of other
                            sites and encourage you to read their privacy
                            statements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            5. Changes to This Policy
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We may update our Privacy Policy from time to time.
                            We will notify you of any changes by posting the new
                            Privacy Policy on this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">
                            6. Contact Us
                        </h2>
                        <p className="text-gray-700">
                            If you have any questions about this Privacy Policy,
                            please contact us at:
                            <br />
                            Email: privacy@animenook.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyAndPolicy;
PrivacyAndPolicy.layout = (page) => <BlogLayout>{page}</BlogLayout>;
