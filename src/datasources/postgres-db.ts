import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'to-do',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PWD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

class PGQueries {
    async getAllTasks() {
        try {
            const client = await pool.connect();
            let result = await client.query("SELECT * FROM TASKS ORDER BY CREATED;");
            client.release();
            console.log(result.rows);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }
    async getBookedUsers(name: String) {
        try {
            const client = await pool.connect();
            let result = await client.query("SELECT * FROM booking_info WHERE train_name = $1", [name]);
            client.release();
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async getTrainInfo(train_name: String) {
        try {
            const client = await pool.connect();
            let result = await client.query("SELECT * FROM train_info WHERE name = $1", [train_name]);
            client.release();
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async updateTrainInfo(train_name: String, username: String, bookedseats: Number) {
        try {
            const client = await pool.connect();
            let result = await client.query("UPDATE train_info SET booked_users = ARRAY_APPEND(booked_users, $1), remainingseats = remainingseats - $3 WHERE name = $2", [username, train_name, bookedseats]);
            client.release();
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async bookTicket(train_name: String, username: String, bookedseats: Number) {
        try {
            const client = await pool.connect();
            let result = await client.query("INSERT INTO booking_info(username, bookedseats, train_name) VALUES($1, $2, $3) ON CONFLICT (username,train_name) DO UPDATE SET bookedseats = booking_info.bookedseats + $2 RETURNING *", [username, bookedseats, train_name]);
            client.release();
            return result.rows;
        } catch (err) {
            throw err;
        }
    }
}

export default PGQueries