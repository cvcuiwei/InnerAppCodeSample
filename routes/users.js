var express = require('express');
var router = express.Router();
const FormData = require('form-data');

const axios = require('axios');
const parser = require('url-parse');
const getToken = async () => {

    return '4fp-drIWCAmDIIJvRv65cYP8PwuMw2dCuJ18ynkRQWZ1R-3aLtGgBbodxWySXkKsA8ZkZ_5ju2Q5DlZyOZaD94vDMWh4kHuMNwVvvBYSbzkAwM8YOzMqpa2fc_8fc7heqbycHTejaa7L1GjTvQ2GFu5GdGW0s_49aVpbSRae-0RISz7VusciOI3edE7cuzy8JF-4clOOJdnZbZrKskprHw';

    let corpid = 'ww827c549fa062654e';
    let corpsecret = '***REMOVED***';

    const { data: { access_token } } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
        params: {
            corpid,
            corpsecret
        }
    });
    console.log('-----------------------');
    console.log('Access Token OK!');
    console.log(access_token);
    console.log('-----------------------');
    return access_token;
};


router.get('/user/get', async function (req, res, next) {
    console.log('User!!!');

    const query = req.query || {};
    console.log(query);
    console.log('Request query is :')

    const access_token = await getToken();

    

    const { data } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/user/get', {
        params: {
            access_token,
            userid: query.userid
        }
    });

    console.log(data);
    res.send(data);


});



router.get('/department/list', async function (req, res, next) {
    const query = req.query || {};
    if (!query.id) {
        query.id = 1;
    }
    const access_token = await getToken();
    console.log(query);


    let filter_departments = []
    const { data:{department:departmentlist} } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/department/list', {
        params: {
            access_token,
            id: query.id || ''
        }
    });

    departmentlist.forEach(item => {
        if (item.parentid == query.id) {
            filter_departments.push({
                id: item.id,
                name: item.name || '',
                type: 'department'
            })
        }
    });
    // if (filter_departments.length > 0) {
    //     for (let index = 0; index < filter_departments.length; index++) {
    //         let element = filter_departments[index];
    //         if (departmentlist.some(item => {
    //             return item.parentid == element.id
    //         })) {
    //             // element.leaf = false;

    //         } else {
    //             // element.leaf = true;
    //         }
    //     }
    // }


    const { data:{userlist} } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/user/simplelist', {
        params: {
            access_token,
            department_id: query.id || '',
            fetch_child: 0
        }
    });

    let filter_users = userlist.map(user => {
        return {
            id:user.userid || '',
            name : user.name || '',
            leaf : true,
            type : 'user'
        }
    });

    console.log(filter_departments);
    console.log(filter_users);
    res.send([].concat(filter_users,filter_departments));


});


router.post('/message/send', async function (req, res, next) {
    let {form:form_parames} = req.body || {};
    console.log(form_parames);
    let request_data  = {
        ...form_parames,
        agentid:1000044,
    }
    request_data.safe = form_parames.safe ? '1' : '0';
    console.log(request_data);    
    const access_token = await getToken();
    const {data} =  await axios.post('https://qyapi.weixin.qq.com/cgi-bin/message/send', 
    request_data,
    {
        params: {
            access_token
        }
        
    });

    console.log(data);

    res.send(data);


});

router.post('/media/upload', async function (req, res, next) {
    
    let {media:file} = req.files || {};
    console.log(req.files);
    
    let {type} = req.body || {} ;
    const access_token = await getToken();

    // 组件一个form，用来上传文件
    const form = new FormData();
    form.append('filename', file.name);
    form.append('filelength', file.size);   
    form.append('media',file.data,file.name);

    const {data} =  await axios.post('https://qyapi.weixin.qq.com/cgi-bin/media/upload', 
    form,
    {
        params: {
            access_token,
            type
        },
        headers: {
            "Content-Type": "multipart/form-data"
        },        
    });

    console.log(data);
    res.send(data);
});




module.exports = router;
