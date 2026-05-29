import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Company */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 font-display">
                            Note<span className="text-primary">X</span>changE
                        </h3>
                        <p className="text-gray-400">
                            Connecting students who need academic work with those who can deliver it.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition">
                                    Browse Tasks
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition">
                                    Post Task
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition">
                                    Become Provider
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-700 mb-4" />
                <div className="flex justify-between items-center text-sm text-gray-400">
                    <p>&copy; 2024 NoteXchangE. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary transition">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-primary transition">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
