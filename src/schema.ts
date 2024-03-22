import { gql } from "graphql-tag"

const typeDefs = gql`
  type Query {
    getAllTasks: [Task!]!
    availableTrains: [Train!]!,
    train(name: String!): Train
  }
  type Task {
    tno: ID!
    task: String!
    created: String!
    done:boolean!
    deleted:boolean!
  }
  type Mutation {
    bookTicket(username: String!, train_name: String!, bookedseats: Int!): BookTicketResponse
  }

  type BookTicketResponse {
        code: Int!
        success: Boolean!
        message: String!
        booking_info: BookingInfo
    }

  type Train {
    id: ID!
    name: String!
    remainingseats: Int!
    ticket_price: String!
    source_station: String
    destination_station: String
    booked_users: [BookingInfo]
  }

  type BookingInfo {
    train_name: String!
    username: String!
    bookedseats: Int
  }
`

export default typeDefs