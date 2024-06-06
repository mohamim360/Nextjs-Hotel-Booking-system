import { hotelModel } from "@/models/hotel-model";
import { ratingModel } from "@/models/rating-model";
import { reviewModel } from "@/models/review-model";
import { bookingModel } from "@/models/booking-model";
import { userModel } from "@/models/user-model";

import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/utils/data-util";

import { isDateInbetween } from "@/utils/data-util";
import { dbConnect } from "@/service/mongo";

export async function getAllHotels(destination, checkin, checkout, category) {
  await dbConnect();
    const regex = new RegExp(destination, "i");
    const hotelsByDestination = await hotelModel
        .find({ city: { $regex: regex } })
        .select(["thumbNailUrl", "name", "highRate", "lowRate", "city", "propertyCategory"])
        .lean();

    let allHotels = hotelsByDestination;

    if (category) {
      const categoriesToMatch = category.split('|');

      allHotels = allHotels.filter(hotel => {
        return categoriesToMatch.includes(hotel.
          propertyCategory.toString())
      })

    }

    if (checkin && checkout) {

        allHotels = await Promise.all(
            allHotels.map(async (hotel) => {
              const found = await findBooking(hotel._id, checkin, checkout);
              console.log(found);
              if (found) {
                hotel["isBooked"] = true;
              } else {
                hotel["isBooked"] = false;
              }
              return hotel;
            })
        );
    }

    return replaceMongoIdInArray(allHotels);
}

async function findBooking(hotelId, checkin, checkout) {
  await dbConnect();
    const matches = await bookingModel
      .find({ hotelId: hotelId.toString() })
      .lean();

    const found = matches.find((match) => {
      return (
        isDateInbetween(checkin, match.checkin, match.checkout) ||
        isDateInbetween(checkout, match.checkin, match.checkout)
      );
    });
    console.log(found);

    return found;
  }

export async function getHotelById(hotelId, checkin, checkout) {
  await dbConnect();
    const hotel = await hotelModel.findById(hotelId).lean();

    if (checkin && checkout) {
        const found = await findBooking(hotel._id, checkin, checkout);
        if (found) {
            hotel["isBooked"] = true;
        }else {
            hotel["isBooked"] = false;
        }
    }
    return replaceMongoIdInObject(hotel);
}

export async function getRatingsForAHotel(hotelId) {
  await dbConnect();
    const ratings = await ratingModel.find({hotelId: hotelId}).lean();
    return replaceMongoIdInArray(ratings);
}

export async function getReviewsForAHotel(hotelId) {
  await dbConnect();
    const reviews = await reviewModel.find({ hotelId: hotelId }).lean();
    return replaceMongoIdInArray(reviews);
}

export async function getUserByEmail(email) {
  await dbConnect();
  const users = await userModel.find({ email: email }).lean();
  return replaceMongoIdInObject(users[0]);
}

export async function getBookingsByUser(userId) {
  await dbConnect();
  const bookings = await bookingModel.find({ userId: userId }).lean();
  return replaceMongoIdInArray(bookings);
}