import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-950 rounded-t-4xl text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Logo and Contact Info */}
          <div className="text-center md:text-left">
            <div className="mb-6">
              <img
                src="/images/logo.png"
                alt="Caterbazar Logo"
                className="h-12 w-auto mx-auto md:mx-0"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <a
                  href="mailto:itcaterbazar@gmail.com"
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  itcaterbazar@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <a
                  href="tel:+917655802071"
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  +91 7655 802 071
                </a>
              </div>
              <div className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Chikkadpally, New Nallakunta, Hyderabad, Telangana, India, 500020
                </span>
              </div>
            </div>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="text-center">
            {/* <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/"
                className="block text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/"
                className="block text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                Contact
              </Link>
            </div> */}
          </div>

          {/* Right Section - Social Media */}
          <div className="text-center md:text-right">
            <h3 className="text-white font-semibold text-lg mb-6">Follow Us</h3>
            <div className="flex justify-center md:justify-end gap-6">
              <a
                href="https://www.facebook.com/profile.php?id=61585158548282"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white  transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/caterbazar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400  transition-colors"
                aria-label="X"
              >
                <img src="/images/X-icons.png" alt="X" className="w-6 h-6 invert" />
              </a>
              <a
                href="https://www.instagram.com/caterbazar/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white  transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/cater-bazar-03302b395/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white  transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-400 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} CaterBazar. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Design by{" "}
                <a
                  href="https://zaiyoai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Zaiyo AI
                </a>
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
