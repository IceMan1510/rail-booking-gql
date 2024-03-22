const resolvers = {
    Query: {
        availableTrains: (_, __, { dataSources }) => {
            try {
                return dataSources.pgQueries.getAvailableTrains();   
            } catch (err) {
                return err.stack
            }
        },
        train: async (_, { name }, { dataSources }) => {
            try {
                let data = await dataSources.pgQueries.getTrainInfo(name);
                console.log(data);
                return data[0];   
            } catch (err) {
                return err.stack
            }
        }
    },
    Mutation: {
        bookTicket: async(_, { username, train_name, bookedseats }, { dataSources }) => {
            try {
                const trainDetails = await dataSources.pgQueries.getTrainInfo(train_name);
                if (trainDetails[0].remainingseats > bookedseats) {
                    let bookingResult = await Promise.all([
                        dataSources.pgQueries.updateTrainInfo(train_name, username, bookedseats),
                        dataSources.pgQueries.bookTicket(train_name, username, bookedseats)
                    ]);
                    return {
                        code: 200,
                        success: true,
                        message: `Booked ${bookedseats} in ${train_name}`,
                        booking_info: bookingResult[1][0]
                    }
                } else {
                    return {
                        code: 200,
                        success: false,
                        message: `Not enoung seats available in ${train_name}`,
                        booking_info: null
                    }
                }
            } catch (err) {
                return {
                    code: 500,
                    success: false,
                    message: err.stack,
                    track: null
                }
            }
        }
    },
    Train: {
        booked_users: ({ name }, _, { dataSources }) => {
            try {
                return dataSources.pgQueries.getBookedUsers(name);
            } catch (err) {
                return err.stack
            }
        }
    }
};
export default resolvers;