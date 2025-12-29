"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // About Our Catering Marketplace
  {
    id: 1,
    question: "What is Cater Bazar catering marketplace?",
    answer:
      "Cater Bazar is a trusted online catering marketplace that connects customers with professional and verified caterers across major cities in India. From intimate family gatherings to large-scale events, Cater Bazar makes booking quality catering services simple, reliable, and completely hassle-free.",
  },
  {
    id: 2,
    question: "Which cities in India does Cater Bazar serve?",
    answer:
      "Cater Bazar operates across multiple cities in India, including major metro cities and rapidly growing urban areas. Caterer availability may vary based on location, ensuring customers get the best local catering options for their events.",
  },
  {
    id: 3,
    question: "What types of catering services are available on Cater Bazar?",
    answer:
      "Cater Bazar offers catering services for weddings, corporate events, birthday parties, house parties, conferences, festivals, and other special occasions, with customizable menus to suit different tastes, budgets, and dietary preferences.",
  },
  // Finding & Booking Caterers
  {
    id: 4,
    question: "How can I find the best caterer in my city?",
    answer:
      "On Cater Bazar, enter your city, event date, and guest count, then filter caterers by cuisine, budget, ratings, and dietary preferences.",
  },
  {
    id: 5,
    question: "Can I compare multiple caterers before booking?",
    answer:
      "Yes, Cater Bazar lets you compare menus, prices, photos, ratings, and reviews before booking.",
  },
  {
    id: 6,
    question: "How does the booking process work on Cater Bazar?",
    answer:
      "Select a caterer, share your event details, and send a request. Once confirmed, complete your booking with secure online payment.",
  },
  // Menus & Customization
  {
    id: 7,
    question: "Can I customize the catering menu?",
    answer:
      "Yes. Cater Bazar allows menu customization based on your preferences, guest count, and event type.",
  },
  {
    id: 8,
    question: "Do you offer vegetarian, vegan, Jain, halal, or gluten-free options?",
    answer:
      "Yes. On Cater Bazar, you can filter caterers by vegetarian, vegan, Jain, halal, gluten-free, and other dietary needs.",
  },
  {
    id: 9,
    question: "Is tasting available before finalizing the caterer?",
    answer:
      "Tasting depends on the caterer and event size. You can discuss this directly with the caterer on Cater Bazar before booking.",
  },
  // Pricing & Payments
  {
    id: 10,
    question: "How much does catering cost in India?",
    answer:
      "Catering cost in India depends on cuisine, number of guests, service style, and city. On Cater Bazar, you can check transparent catering prices in India and compare the best catering services in your area.",
  },
  {
    id: 11,
    question: "Are there any hidden charges when booking caterers online?",
    answer:
      "No. Cater Bazar ensures complete price transparency. All catering charges, service fees, and applicable taxes are clearly shown before you book caterers online.",
  },
  {
    id: 12,
    question: "What payment methods are accepted for online catering services?",
    answer:
      "Cater Bazar supports flexible payment options. Payments are made directly with caterers using UPI, bank transfer, or other agreed methods for secure online catering bookings.",
  },
  {
    id: 13,
    question: "What is the cancellation policy on Cater Bazar?",
    answer:
      "Cancellation policies vary by caterer on Cater Bazar. We recommend checking the caterer's cancellation and refund terms before confirming your catering booking.",
  },
  {
    id: 14,
    question: "Will I receive a refund if I cancel my catering order?",
    answer:
      "Refunds depend on the caterer's cancellation policy and how early you cancel before the event date. Cater Bazar displays these details to help you book catering services online with clarity and confidence.",
  },
  // Quality, Trust & Safety
  {
    id: 15,
    question: "Are caterers verified on Cater Bazar?",
    answer:
      "Yes. All caterers on Cater Bazar are verified to meet quality, hygiene, and professional service standards.",
  },
  {
    id: 16,
    question: "Can I check caterer reviews and ratings?",
    answer:
      "Yes. Cater Bazar displays genuine customer reviews and ratings on each caterer's profile to help you choose the best catering services near you.",
  },
  {
    id: 17,
    question: "What if I face an issue with the catering service?",
    answer:
      "Cater Bazar's customer support team assists you and coordinates with the caterer to resolve issues quickly and smoothly.",
  },
  // For Caterers & Partners
  {
    id: 18,
    question: "How can caterers register on Cater Bazar?",
    answer:
      "Caterers can register on Cater Bazar by submitting business details, menus, and required documents through the partner registration page.",
  },
  {
    id: 19,
    question: "Is there a commission or subscription fee for caterers?",
    answer:
      "Yes. Cater Bazar offers flexible commission and subscription plans designed for catering businesses of all sizes.",
  },
  {
    id: 20,
    question: "How and when do caterers receive payments on Cater Bazar?",
    answer:
      "Payments are securely transferred to the caterer's registered bank account after the successful completion of the event.",
  },
  // Support & Contact
  {
    id: 21,
    question: "How can I contact Cater Bazar customer support?",
    answer:
      "You can contact Cater Bazar customer support via email, phone, or live chat. All support details are available on the Cater Bazar website.",
  },
  {
    id: 22,
    question: "Is Cater Bazar customer support available during events?",
    answer:
      "Yes. Cater Bazar provides customer support during your event to help resolve any last-minute catering issues quickly.",
  },
  {
    id: 23,
    question: "How quickly does Cater Bazar respond to support queries?",
    answer:
      "Cater Bazar aims to respond to customer support queries as quickly as possible, ensuring smooth and reliable online catering service support.",
  },
];

interface FAQAccordionProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: (id: number) => void;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => onToggle(item.id)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <h3 className="font-semibold text-gray-900">{item.question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-orange-600 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export default function BlogPage() {
  const [openId, setOpenId] = React.useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="bg-white text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl text-black md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-black">
              Everything you need to know about Cater Bazar and our catering
              services
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* About Our Catering Marketplace Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              About Our Catering Marketplace
            </h2>
            <div className="space-y-4">
              {faqData.slice(0, 3).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* Finding & Booking Caterers Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              Finding & Booking Caterers
            </h2>
            <div className="space-y-4">
              {faqData.slice(3, 6).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* Menus & Customization Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              Menus & Customization
            </h2>
            <div className="space-y-4">
              {faqData.slice(6, 9).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* Pricing & Payments Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              Pricing & Payments
            </h2>
            <div className="space-y-4">
              {faqData.slice(9, 14).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* Quality, Trust & Safety Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              Quality, Trust & Safety
            </h2>
            <div className="space-y-4">
              {faqData.slice(14, 17).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* For Caterers & Partners Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              For Caterers & Partners
            </h2>
            <div className="space-y-4">
              {faqData.slice(17, 20).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* Support & Contact Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-orange-600 text-center">
              Support & Contact
            </h2>
            <div className="space-y-4">
              {faqData.slice(20, 23).map((item) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          {/* <section className="bg-orange-50 rounded-lg p-8 mt-16 text-center border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6">
              Our customer support team is here to help you with any queries
              about our catering services.
            </p>
            <a
              href="mailto:support@caterbazar.com"
              className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Contact Support
            </a>
          </section> */}
        </div>
      </div>
    </>
  );
}
