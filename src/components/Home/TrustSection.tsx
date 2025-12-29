"use client";

import React, { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { getTopRatedReviews, ReviewData } from "@/api/user/public.api";

// Static demo reviews as fallback
const demoTestimonials = [
  {
    id: 1,
    name: "Rhea Kapoor",
    role: "Verified Host",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    testimonial:
      "Caterbazar helped us book the perfect wedding caterer — the food was incredible, the service punctual, and our guests couldn't stop complimenting the menu. Stress-free planning!",
    title: "Perfect Wedding Experience",
    rating: 5,
    foodQuality: 5,
    serviceQuality: 5,
    valueForMoney: 5,
    hygiene: 5,
    vendorResponse: undefined,
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "Event Planner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    testimonial:
      "Transparent pricing and quick vendor replies saved us hours. We compared menus, scheduled a tasting, and confirmed the caterer all within a week.",
    title: "Fast and Efficient Service",
    rating: 5,
    foodQuality: 5,
    serviceQuality: 5,
    valueForMoney: 4,
    hygiene: 5,
    vendorResponse: undefined,
  },
  {
    id: 3,
    name: "Neha Rao",
    role: "Birthday Host",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    testimonial:
      "I needed a pure-veg menu at short notice — Green Bowl Caterers delivered beautifully. Friendly team, neat presentation, and everyone loved the food.",
    title: "Great Last-Minute Service",
    rating: 5,
    foodQuality: 5,
    serviceQuality: 4,
    valueForMoney: 5,
    hygiene: 5,
    vendorResponse: undefined,
  },
];

const ratings = [
  { text: "Rated 5 Stars in Customer Reviews", stars: 5 },
  { text: "Recommended by Event Planners", stars: 5 },
  { text: "Top Rated on Event Guides", stars: 5 },
];

export default function TrustSection() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [useStaticReviews, setUseStaticReviews] = useState(false);

  useEffect(() => {
    const fetchTopRatedReviews = async () => {
      setLoading(true);
      try {
        const response = await getTopRatedReviews({
          page: 1,
          limit: 3,
          rating: 4,
          sortBy: 'recent',
        });

        if (response.success && response.data.reviews.length > 0) {
          setReviews(response.data.reviews);
          setUseStaticReviews(false);
        } else {
          setUseStaticReviews(true);
        }
      } catch (error) {
        console.error('Error fetching top-rated reviews:', error);
        setUseStaticReviews(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedReviews();
  }, []);

  // Format testimonials from API reviews or use static
  const testimonials = useStaticReviews
    ? demoTestimonials
    : reviews.map((review) => ({
        id: review._id,
        name: review.userId?.fullName || review.vendorId.fullName || 'Anonymous User',
        role: 'Verified Customer',
        image: review.userId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId?.fullName || review.vendorId.fullName || 'User')}&background=random`,
        testimonial: review.comment,
        title: review.title,
        rating: review.rating,
        foodQuality: review.foodQuality,
        serviceQuality: review.serviceQuality,
        valueForMoney: review.valueForMoney,
        hygiene: review.hygiene,
        vendorResponse: review.vendorResponse,
      }));

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Trust Info and Ratings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-10 lg:mb-12">
          {/* Left Side - Trust Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              10,000+ hosts trust{" "}
              <span className="italic text-orange-500 font-serif">Caterbazar</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              We connect you with verified caterers who deliver great food and
              flawless service. Read real stories from hosts who planned
              memorable events with Caterbazar.
            </p>
          </div>

          {/* Right Side - Rating Badges */}
          <div className="space-y-3 sm:space-y-4">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className="bg-orange-50 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
              >
                <div className="flex gap-0.5 sm:gap-1">
                  {[...Array(rating.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{rating.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Testimonials in One Row */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 lg:pb-0  px-2 sm:mx-0 sm:px-0">
            <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 min-w-max lg:min-w-0">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-orange-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:bg-orange-600 transition-colors w-[280px] sm:w-[320px] lg:w-auto shrink-0"
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm sm:text-base lg:text-lg">{testimonial.name}</h4>
                      <p className="text-orange-100 text-xs sm:text-sm">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < testimonial.rating
                              ? 'fill-yellow-300 text-yellow-300'
                              : 'fill-orange-300 text-orange-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  {testimonial.title && (
                    <h5 className="font-bold text-sm sm:text-base mb-2 text-white">
                      {testimonial.title}
                    </h5>
                  )}

                  {/* Review Comment */}
                  <p className="text-white/90 leading-relaxed text-xs sm:text-sm mb-3">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Quality Ratings */}
                  {!useStaticReviews && (
                    <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-orange-400/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-100">Food Quality:</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < testimonial.foodQuality!
                                  ? 'fill-yellow-300 text-yellow-300'
                                  : 'fill-orange-300 text-orange-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-100">Service:</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < testimonial.serviceQuality!
                                  ? 'fill-yellow-300 text-yellow-300'
                                  : 'fill-orange-300 text-orange-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-100">Value:</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < testimonial.valueForMoney!
                                  ? 'fill-yellow-300 text-yellow-300'
                                  : 'fill-orange-300 text-orange-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-100">Hygiene:</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < testimonial.hygiene!
                                  ? 'fill-yellow-300 text-yellow-300'
                                  : 'fill-orange-300 text-orange-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vendor Response */}
                  {/* {testimonial.vendorResponse && (
                    <div className="bg-orange-600/50 rounded-lg p-3 mt-3">
                      <p className="text-xs font-semibold text-orange-100 mb-1">Vendor Response:</p>
                      <p className="text-xs text-white/90">{testimonial.vendorResponse.message}</p>
                      <p className="text-[10px] text-orange-200 mt-1">
                        {new Date(testimonial.vendorResponse.respondedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
