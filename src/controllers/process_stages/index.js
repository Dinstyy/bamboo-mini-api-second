import axios from 'axios';

const ACCURATE_API_URL = process.ACCURATE_API_URL || 'https://zeus.accurate.id/accurate/api';
const ACCURATE_TOKEN = process.ACCURATE_TOKEN || '5cd9371a-f379-4c19-bde9-736c1958fa5b';
const ACCURATE_SESSION_ID = process.ACCURATE_SESSION_ID || '4349c7e7-b814-4f3c-a264-6d9291a037cd';

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

export const getProcessStagesList = async (req, res) => {
    try {
        const { fields, page, pageSize, sort } = req.query;
        let { tanggal_mulai, tanggal_akhir } = req.body || {};
        
        const params = {};
        params.fields = fields || 'id,number,transDate';
        if (page) params.page = page;
        if (pageSize) params.pageSize = pageSize;
        if (sort) params.sort = sort;
        
        const data = await accurateRequest('/process-stages/list.do', params);
        
        let results = data.d || [];
        
        if (tanggal_mulai && tanggal_akhir) {
            results = results.filter(item => {
                return item.transDate === tanggal_mulai || item.transDate === tanggal_akhir;
            });
        } else if (tanggal_mulai) {
            results = results.filter(item => item.transDate === tanggal_mulai);
        } else if (tanggal_akhir) {
            results = results.filter(item => item.transDate === tanggal_akhir);
        }
        results.data[0].workOrderNumber = "testing"
        
        res.json({
            success: true,
            data: results,
            pagination: data.sp || null
        });
    } catch (error) {
        console.error('Error fetching process stages list:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch process stages list',
            details: error.response?.data || error.message
        });
    }
};

export const getProcessStageDetail = async (req, res) => {
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
};