import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 5002;

const ACCURATE_API_URL = process.env.ACCURATE_API_URL || 'https://zeus.accurate.id/accurate/api';
const ACCURATE_TOKEN = process.env.ACCURATE_TOKEN || '5cd9371a-f379-4c19-bde9-736c1958fa5b';
const ACCURATE_SESSION_ID = process.env.ACCURATE_SESSION_ID || '4349c7e7-b814-4f3c-a264-6d9291a037cd';

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accurateRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${ACCURATE_API_URL}${endpoint}`, {
            params: params,
            headers: {
                'Authorization': `Bearer ${ACCURATE_TOKEN}`,
                'X-Session-ID': ACCURATE_SESSION_ID
            }
        });
        return response.data;
    } catch (error) {
        console.error('Accurate API Error:', error.response?.data || error.message);
        throw error;
    }
};

app.get('/api/process-stages/list', async (req, res) => {
    try {
        const { fields, page, pageSize, sort } = req.query;
        
        const params = {};
        if (fields) params.fields = fields;
        if (page) params.page = page;
        if (pageSize) params.pageSize = pageSize;
        if (sort) params.sort = sort;
        
        const data = await accurateRequest('/process-stages/list.do', params);
        
        res.json({
            success: true,
            data: data.d || [],
            pagination: data.sp || null,
            raw: data
        });
    } catch (error) {
        console.error('Error fetching process stages list:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch process stages list',
            details: error.response?.data || error.message
        });
    }
});

app.get('/api/process-stages/detail', async (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                error: 'ID parameter is required' 
            });
        }
        
        const data = await accurateRequest('/process-stages/detail.do', { id });
        
        res.json({
            success: true,
            data: data.d || data,
            raw: data
        });
    } catch (error) {
        console.error('Error fetching process stage detail:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch process stage detail',
            details: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`List: http://localhost:${PORT}/api/process-stages/list?fields=id,number,transDate`);
    console.log(`Detail: http://localhost:${PORT}/api/process-stages/detail?id=200`);
});