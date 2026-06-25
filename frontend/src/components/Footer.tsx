import React from 'react';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">

                {/* Brand */}
                <div className="footer-brand">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(247,103,0,0.25)', flexShrink: 0
                        }}>
                            <img src="/IMG_2556.PNG" alt="NoteXchangE" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'white' }}>
                            Note<span style={{ color: '#f76700' }}>X</span>chang<span style={{ color: '#f76700' }}>E</span>
                        </span>
                    </div>
                    <p className="footer-desc">
                    Is a student-first platform for academic collaboration. It connects students who need help with their academic work (written manuals, assignments, labs, projects) with other students who assist in completing them, creating a secure environment where students can earn by helping one another.
                    </p>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li>Email: <a href="mailto:support@notexchange.com">support@notexchange.com</a></li>
                        <li>Phone: <a href="tel:+919999999999">+91 99999 99999</a></li>
                        <li>Available: Mon – Sat</li>
                    </ul>
                </div>

                {/* Support */}
                <div className="footer-col">
                    <h4>Customer Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">How It Works</a></li>
                        <li><a href="#">Report a Problem</a></li>
                        <li><a href="#">Terms & Privacy</a></li>
                    </ul>
                </div>

                {/* Social */}
                <div className="footer-col">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <div className="insta icon-sz">
                            <a href="https://www.instagram.com/accounts/login/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="none" viewBox="0 0 23 24">
                                    <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>

                        <div className="linked icon-sz">
                            <a href="#" aria-label="LinkedIn">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="35" height="33" fill="currentColor" viewBox="0 0 22 24">
                                    <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
                                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                </svg>
                            </a>
                        </div>

                        <div className="git icon-sz">
                            <a href="#" aria-label="GitHub">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="31" height="31" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>

                        <div className="tele icon-sz">
                            <a href="#" aria-label="WhatsApp">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="31" height="31" fill="none" viewBox="0 0 24 24">
                                    <path fill="currentColor" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z" clipRule="evenodd" />
                                    <path fill="currentColor" d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z" />
                                </svg>
                            </a>
                        </div>

                        <div className="gift icon-sz">
                            <a href="#" aria-label="Gift">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 7h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C10.4 2.842 8.949 2 7.5 2A3.5 3.5 0 0 0 4 5.5c.003.52.123 1.033.351 1.5H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-9.942 0H7.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM13 14h-2v8h2v-8Zm-4 0H4v6a2 2 0 0 0 2 2h3v-8Zm6 0v8h3a2 2 0 0 0 2-2v-6h-5Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} NoteXchangE &bull; Built for students, by student.
            </div>
        </footer>
    );
}
