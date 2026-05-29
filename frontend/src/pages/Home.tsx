import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 text-gray-900">
                            Connect, Collaborate, Complete
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            An academic collaboration platform designed to connect students who need academic work
                            with those who can deliver it and earn.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/browse"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
                            >
                                Browse Tasks
                            </Link>
                        </div>
                    </motion.div>

                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-display">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* For Clients */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
                        >
                            <BookOpen className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-4">Post Your Task</h3>
                            <p className="text-gray-600">
                                Describe your academic needs and set your budget. Connect with qualified
                                service providers instantly.
                            </p>
                        </motion.div>

                        {/* For Providers */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
                        >
                            <Users className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-4">Offer Your Skills</h3>
                            <p className="text-gray-600">
                                Browse available tasks, place bids, and showcase your expertise to earn
                                money while helping students.
                            </p>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
                        >
                            <TrendingUp className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-4">Grow & Succeed</h3>
                            <p className="text-gray-600">
                                Build your reputation with ratings and reviews, track your progress, and
                                receive secure payments.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary to-orange-600 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-display">Ready to Get Started?</h2>
                    <p className="mb-8 text-lg opacity-90">
                        Join thousands of students and service providers on NoteXchangE
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold"
                    >
                        Sign Up Now
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
