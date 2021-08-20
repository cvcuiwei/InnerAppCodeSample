const axios = require('axios');
const parser = require('url-parse');
const getToken = async(corpid, corpsecret) => {
        const { data: { access_token } } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
            params: {
                corpid,
                corpsecret
            }
        });
        return access_token;
};
exports.contextMngApi =  (app) => {
    app.get('/api/user/create', async (req,res) =>  {
        const {query} = parser(req.originalUrl, true);
        const {data} = await axios.post('https://qyapi.weixin.qq.com/cgi-bin/user/create', {
            params: query
        });
        res.end(data);
    })
    app.post('/api/user/get', async (req,res) =>  {
        const { query } = parser(req.originalUrl, true);
        const access_token = await getToken(query.corpid, query.corpsecret);
        const {data} = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/user/get', {
            params: {
                access_token,
                userid: query.userid
            }
        });
        res.end(data);
        
    })
}