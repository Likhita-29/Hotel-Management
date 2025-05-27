import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Box, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [occupancyData, setOccupancyData] = useState([]);
    const [bookingTrends, setBookingTrends] = useState([]);
    const [roomAvailabilityData, setRoomAvailabilityData] = useState([]);

    const API_BASE_URL = "http://localhost:4000";
    const ROOM_BASE_URL = `${API_BASE_URL}/room`;
    const BOOKING_BASE_URL = `${API_BASE_URL}/booking`;



    const fetchData = async () => {
        try {
            // Fetch rooms
            const roomsResponse = await axios.get(`${ROOM_BASE_URL}/get-allroom`);
            const roomsData = roomsResponse.data.room;
            setRooms(roomsData);

            // Fetch bookings
            const bookingsResponse = await axios.get(`${BOOKING_BASE_URL}/get-allbooking`);
            const bookingsData = bookingsResponse.data.booking;
            setBookings(bookingsData);

            // Process data for charts
            processChartData(roomsData, bookingsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const processChartData = (roomsData, bookingsData) => {
        // Process room availability data
        const availableRooms = roomsData.filter(room => room.status === "Available").length;
        const unavailableRooms = roomsData.length - availableRooms;
        setRoomAvailabilityData([
            { name: 'Available', value: availableRooms },
            { name: 'Unavailable', value: unavailableRooms }
        ]);

        // Process daily revenue data (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const revenueData = last7Days.map(date => {
            const dayBookings = bookingsData.filter(booking =>
                booking.checkIn && booking.checkIn.split('T')[0] === date
        );
            
            const revenue = dayBookings.reduce((sum, booking) => 
                sum + (parseFloat(booking.totalPrice) || 0), 0
            );
            return { date, revenue };
        });
        setDailyRevenue(revenueData);
        console.log("Processed Daily Revenue:", revenueData);

        // Process occupancy data
        const totalRooms = roomsData.length;
        const occupiedRooms = roomsData.filter(room => 
            room.status === "Unavailable" 
        ).length;
        const occupancyPercentage = (occupiedRooms / totalRooms) * 100;
        setOccupancyData([
            { name: 'Occupancy', percentage: occupancyPercentage },
            { name: 'Vacant', percentage: 100 - occupancyPercentage }
        ]);

        // Process booking trends by room type
        const roomTypeBookings = roomsData.reduce((acc, room) => {
            acc[room.roomType] = (acc[room.roomType] || 0) + 1;
            return acc;
        }, {});
        
        const bookingTrendsData = Object.entries(roomTypeBookings).map(([type, count]) => ({
            name: type,
            value: count
        }));
        setBookingTrends(bookingTrendsData);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                {/* Room Availability Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={{ fontSize: '16px' }}  gutterBottom>
                            Room Availability
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roomAvailabilityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill=" #8884d8"
                                    dataKey="value"
                                >
                                    {roomAvailabilityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Daily Revenue Line Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={{ fontSize: '16px' }} gutterBottom>
                            Daily Revenue (Last 7 Days)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="rgb(22, 19, 80)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Occupancy Percentage Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={{ fontSize: '16px' }} gutterBottom>
                            Occupancy Percentage
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={occupancyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="percentage" fill=" #DB304A" />  {/*  Yellow = #FFB347  */}
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Booking Trends Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={{ fontSize: '16px' }} gutterBottom>
                            Booking Trends by Room Type
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={bookingTrends}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {bookingTrends.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;