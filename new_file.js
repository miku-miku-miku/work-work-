query: async function([key, query]) { // 查验结果列表查询
    let sortData = await handleGetData();
    query = query || {};
    // 如果 multipQuery 不存在或其中的 SORTFIELDS、SORTCRITERIA 为空，则使用默认值
    let sortFields = sortData && sortData.SORTFIELDS ? sortData.SORTFIELDS : 'jlsj';
    let sortCriteria = sortData && sortData.SORTCRITERIA ? sortData.SORTCRITERIA : 'desc';
    // 直接定义或覆盖 query 里的 orderby 字段
    query.orderby = `${sortFields},${sortCriteria}`;
    startFname(['foldersList_1682246496157', 'loadList'], query);
},
openSort: function() {// 排序页面功能
    startFname(['aModel_1740047877960', 'openOrderBy'], '');
    funName('handleSetData', {
        SORTFIELDS: 'jlsj',
        SORTCRITERIA: 'desc',
    });
},
showAdd: function () {
    let dateId = Number(new Date())
    localStorage.setItem('PC', dateId)
    startFname(['flexBox_1682238164546', 'showAdd'], '')
},
closeAdd: function () {
    startFname(['flexBox_1682238164546', 'closeAdd'], '')
},
updateFile: function() {//打开上传发票
    let dateId = Number(new Date())
    localStorage.setItem('PC1', dateId)
    this.fpSelectBPMList = null;
    let postData = {
        type: "FRZTBT_date",
        userID: localStorage.getItem("userID"),
        pageindex: 1,
        pagesize: 100,
    }
    postFormAction('/NEWKP/CWAPI/GetSsgslb', postData, (res) => {
        let params = {
            QYSH: '',
            ISGWFP: '0',
        }
        if (res.Result == '1') {
            let ssgsList = res.rows.find((item) => item.GSGS == "是");
            if (ssgsList) params.QYSH = ssgsList.FRSH;
        }
        startFname(['upLoadInvoice_1682260079171', 'openUpdete'], [params, 'hb'])//'fg'覆盖,'hb'合并
    })
},
upDateOk: function([key, res, file]) {//上传发票回调
    // startFname(['startSm_1682241185304', 'loadList'], '')
    startFname(['foldersList_1682246496157', 'loadList'], '')
    if (res.rows && res.rows.length > 0) {
        startFname(['aModel_1716961873380', 'fpListOpen'], res)
    } else {
        startFname(['flexBox_1682238164546', 'closeAdd'], '')
    }
},
openFpInfo: function(res) {//纠正/查验结果
    res[1].isEditMode = true;
    let fpzlDzGdcs = "type=fpzlbList,controltype=1"
    // console.log('res', res)
    if (res[1].ISGWFP == '0') {
        fpzlDzGdcs += ",zllb=国内"
    } else {
        fpzlDzGdcs += ",zllb=国外"
    }
    funName('setComponentOptionsValue', ['invoiceInfo_1709516607988', { fpzlDzGdcs: fpzlDzGdcs }])
    startFname(['invoiceInfo_1709516607988', 'openCyjg'], res[1])
},
operateBtn: function(res) {
    if (res[1] == 'delete') {
        confirm('确认删除', '是否删除该数据？', 'smscConfirm', { FPID: res[2].FPID })
    } else {
        startFname(['invoiceInfo_1709516607988', 'openCyjg'], res[2])
    }
},
smscConfirm: function(res) {
    postFormAction('/NEWKP/CWAPI/SCFP', res[1], 'fpsmDeleteOk')
},
fpsmDeleteOk: function(res) {
    if (res[1].Result == '1') {
        funName('successMessage', res[1].Message)
        startFname(['startSm_1682241185304', 'loadList'], '')
    }
},
allCheck: function(res) {
    startFname(['foldersList_1682246496157', 'allCheck'], '')
},
checkDelete: function(res) {
    let checkList = startFname(['foldersList_1682246496157', 'getCheck'], '')
    if (checkList.length > 0) {
        let dataList = [];
        for (let i = 0; i < checkList.length; i++) {
            dataList.push(checkList[i].FPID);
        }
        let FPID = dataList.toString().replace(/,/g, '|');
        confirm('确认删除', '是否删除已勾选数据？', 'scConfirm', { FPID: FPID })
    } else {
        funName('warningMessage', '请至少选中一条数据')
    }
},
scConfirm: function(res) {
    postFormAction('/NEWKP/CWAPI/SCFP', res[1], 'fpDeleteOk')
},
fpDeleteOk: function(res) {
    if (res[1].Result == '1') {
        funName('successMessage', res[1].Message)
        startFname(['foldersList_1682246496157', 'loadList'], '')
    }
},
editOk: function(res) {
    let params = res[1];
    console.log('res', res)
    //请求国家
    postFormAction('/newkp/CWAPI/Getgjlist', {}, res => {
        if (res.Result == '1') {
            let gjList = res.rows;
            if (params.GJCODE) {
                const gjItem = gjList.find(item => item.VALUE === params.GJCODE);
                if (gjItem) {
                    params.GJNAME = gjItem.LABEL;
                } else {
                    funName('errorMessage', `GJNAME 为空`);
                    return;
                }
            }
            if (['02', '10', '90', '901', '902', '903', '904', '905', '03', '04', '07', '05', '06'].includes(params.FPZL)) {
                params.YFPZL = params.FPZL;
            }
            console.log('params:', params)
            postFormAction('/NEWKP/CWAPI/SGRRCYFP', params, 'fpEditok')

        } else {
            funName('errorMessage', res.Message)
        }
    })
},
fpEditok: function(res) {
    if (res[1].Result == '1') {
        funName('successMessage', res[1].Message)
        startFname(['foldersList_1682246496157', 'loadList'], '')
        startFname(['startSm_1682241185304', 'loadList'], '')
        startFname(['invoiceInfo_1709516607988', 'closeCyjg'], '')
    } else {
        startFname(['foldersList_1682246496157', 'loadList'], '')
        startFname(['invoiceInfo_1709516607988', 'closeCyjg'], '')
    }
},
smyOk: function(res) {
    let fpinList = res[1].smValue.split(',')
    let dateId = Number(new Date())
    let fpinfo = {
        FPDM: fpinList[2],
        FPHM: fpinList[3],
        FPJE: fpinList[4],
        KPRQ: fpinList[5],
        XYM: fpinList[6],
        XMID: localStorage.getItem('XMID'),
        PC: localStorage.getItem('PC'),
        PC1: dateId
    }
    postFormAction('/NEWKP/SJJX/SGRR', fpinfo, 'fpEditok')
},
openSmy: function(res) {
    postFormAction('http://127.0.0.1:829/', JSON.stringify({
        "LX": "SCANANDRESULT",
    }), 'SCANANDRESULTOK')
},
SCANANDRESULTOK: function(res) {
    // debugger
    if (res[1].Result == '1') { }
},
sglrFile: function(res) {
    let postData = {
        type: "FRZTBT_date",
        userID: localStorage.getItem("userID"),
        pageindex: 1,
        pagesize: 100,
    }
    postFormAction('/NEWKP/CWAPI/GetSsgslb', postData, (res) => {
        let data = {
            BPMFYLB: '差旅费',
            BPMKMBM: '55020012',
            QYSH: '',
            ISGWFP: '1',
        }
        if (res.Result == '1') {
            let sglrList = res.rows.find((item) => item.GSGS == "是");
            if (sglrList) data.QYSH = sglrList.FRSH;
        }
        startFname(['sglrInvoice_1683728890634', 'openSglr'], ['open', data])
    });
},
sglrOk: async function([key, params]) {
    for (const i in params) {
        if (Object.prototype.hasOwnProperty.call(params, i)) {
            const item = params[i];
            if (item instanceof File) {
                params[i] = `[${await funName('fileToType', [item, 'Base64'])}]`
            }
        }
    }
    postFormAction('/newkp/CWAPI/Getgjlist', {}, res => {
        if (res.Result == '1') {
            let gjList = res.rows;
            if (params.GJCODE) {
                const gjItem = gjList.find(item => item.VALUE === params.GJCODE);
                if (gjItem) {
                    params.GJNAME = gjItem.LABEL;
                } else {
                    funName('errorMessage', `GJNAME 为空`);
                    return;
                }
            }
            if (!params.BPMFYLB) {
                funName('errorMessage', `BPM费用类别为空`);
            }
            if (!params.BPMKMBM) {
                funName('errorMessage', `BPMFYLB的BPM科目编码为空`);
            }
            let xmid = localStorage.getItem('XMID')
            let fpinfo = {
                XMID: xmid,
                SJLY: 'pc',
                ...params
            }
            uploadFile('/NEWKP/CWAPI/SGRR', fpinfo, res => {
                if (res.Result == '1') {
                    funName('successMessage', res.Message)
                    startFname(['sglrInvoice_1683728890634', 'closeSglr'], '')
                    startFname(['foldersList_1682246496157', 'loadList'], '')
                } else {
                    funName('errorMessage', res.Message || '网络异常,请重试')
                }
            })
        } else if (res.Message) {
            funName('errorMessage', res.Message)
        } else {
            funName('errorMessage', '网络异常,请重试')
        }
    })
},
fpListOpenCB(res){// 打开识别后的列表

    this.fpSelectBPMList = res[1].rows
    this.editList = {}
    console.log('fpListOpenCB.editList', this.editList)
    startFname(['tableBox_1716961910787', 'setLoadList'], res[1])
},
// BPM----------------start
fpSelectBPM(res){// 识别后--费用类别列表
    console.log('原始 res:', res);
    this.fpSelect = [res[1]]
    this.operationType = 'plxgfylb';
    // 打开弹窗或触发其他逻辑
    startFname(['aModel_1716340037568', 'BPMOpen'], '');
},
selectBPM(){// 修改--费用类别列表
    this.fpSelect = null;
    this.operationType = null;
    startFname(['aModel_1716340037568', 'BPMOpen'], '')
},
BPMQuery(value){// 费用类别查询
    startFname(['tableBox_1716340051686', 'loadList'], value[1])
},
BPMSelect([key, item]) { // 费用类别的选择
    debugger
    console.log('item', item)
    let data = {
        BPMKMBM: item.BPMKMBM,
        BPMFYLB: item.BPMFYLB,
        SPHFWFLJC: item.SPHFWFLJC,
    };

    console.log('data', data)
    if (this.operationType === 'plxgfylb' && this.fpSelect && Array.isArray(this.fpSelect)) {
        // 遍历 this.fpSelect 中的每一条发票记录

        try {
            console.log('fpSelect', this.fpSelect)

            this.fpSelect.forEach(fp => {
                const cleanData = JSON.parse(JSON.stringify(data));

                if (this.editList[fp.FPID]) {
                    // 合并：新 data + 保留原有 editList 中的字段 + 强制更新 FPID
                    this.editList[fp.FPID] = {
                        ...cleanData,
                        ...this.editList[fp.FPID],
                        FPID: fp.FPID
                    };
                } else {
                    this.editList[fp.FPID] = {
                        ...cleanData,
                        FPID: fp.FPID
                    };
                }
            });
        } catch (error) {
            console.log('error', error)
        }
        // console.log('data.FPID', data.FPID)
        // 刷新表格组件,赋值,空数组
        startFname(['tableBox_1716961910787', 'setLoadList'], { rows: [] });
        setTimeout(() => {
            startFname(['tableBox_1716961910787', 'setLoadList'], {
                rows: JSON.parse(JSON.stringify(this.fpSelectBPMList))
            });

            // 关闭弹窗
            startFname(['aModel_1716340037568', 'BPMClose'], '');
        }, 300);
    } else if (this.operationType === 'xgfylb') {
        // 进入 xgfylb 分支
        let resList = { success: 0, error: 0 }; // 修复变量未定义问题
        let promises = this.fpSelect.map((a) => {
            console.log('item', item.FPID)
            console.log('a.FPID', a.FPID)
            let postData = {
                BPMKMBM: item.BPMKMBM,
                BPMFYLB: item.BPMFYLB,
                SPHFWFLJC: item.SPHFWFLJC,
                FPID: a.FPID,
            };
            console.log('postData', postData)
            return new Promise((resolve) => {
                postFormAction('/NEWKP/CWAPI/SGRRCYFP', postData, (res) => {
                    if (res.Result === '1') {
                        resList.success++;
                    } else {
                        resList.error++;
                    }
                    resolve();
                });
            });
        });

        Promise.all(promises)
            .then(() => {
                if (resList.success === 0) {
                    funName('errorMessage', '全部修改失败');
                } else {
                    if (resList.error === 0) {
                        funName('successMessage', '全部修改成功');
                    } else {
                        funName('warningMessage', `共勾选 ${this.fpSelect.length} 条数据进行修改，成功 ${resList.success} 条，失败 ${resList.error} 条`);
                    }
                    startFname(['foldersList_1682246496157', 'loadList'], '')
                    startFname(['aModel_1716340037568', 'BPMClose'], '');
                }
            })
            .catch((errors) => {
                console.error('批量修改失败:', errors);
                funName('errorMessage', '网络异常，请重试');
            });
    } else {
        // 如果没有选中发票，则直接传递费用类别信息到其他组件
        startFname(['sglrInvoice_1683728890634', 'changeData'], data);
        startFname(['invoiceInfo_1709516607988', 'changeData'], data);
        startFname(['invoiceInfo_1733899013599', 'changeData'], data);
        startFname(['aModel_1716340037568', 'BPMClose'], '');
    }
},
// BPM----------------end
/// 法人主体--------------start
fpSelectFRZT(res){// 打开法人主体列表
    this.fpSelect = res[1];
    startFname(['aModel_1719278991038', 'FRZTOpen'], '')
},
FRZTQuery([key, value]){// 法人主体列表查询
    startFname(['tableBox_1719279032535', 'loadList'], value)
},
FRZTSelect([key, item]) {// 选择法人主体
    let data = {
        QYSH: item.FRSH,
        FRMC: item.FRMC,
        FPID: this.fpSelect.FPID,
    }
    //把需要提交修改的数据存起来
    if (this.editList[data.FPID]) {
        this.editList[data.FPID] = { ...this.editList[data.FPID], ...data }
    } else {
        this.editList[data.FPID] = data;
    }
    for (let index = 0; index < this.fpSelectBPMList.length; index++) {
        const fp = this.fpSelectBPMList[index];
        if (fp.FPID == this.fpSelect.FPID) this.fpSelectBPMList[index] = { ...fp, ...data }
    }
    startFname(['tableBox_1716961910787', 'setLoadList'], { rows: JSON.parse(JSON.stringify(this.fpSelectBPMList)) })
    startFname(['aModel_1719278991038', 'FRZTClose'], '')
},
/// 法人主体------------------end
fpList_commit(){// 发票列表修改_提交
    const isEmpty = (obj) => Object.getOwnPropertyNames(obj).length === 0;// 判断是否为空
    console.log('isEmpty', isEmpty)
    if (isEmpty(this.editList)) {
        startFname(['aModel_1716961873380', 'fpListClose'], '')
        startFname(['flexBox_1682238164546', 'closeAdd'], '')
    } else {
        let promises = [];
        this.fpList_ErrList = []
        // debugger
        console.log('this.editList', this.editList)
        for (const FPID in this.editList) {
            console.log('const.FPID', FPID)
            if (Object.hasOwnProperty.call(this.editList, FPID)) {
                console.log('this.editList', this.editList)
                const item = this.editList[FPID];
                console.log('const.item2', item)
                promises.push(
                    new Promise((resolve, reject) => {
                        postFormAction('/NEWKP/CWAPI/SGRRCYFP', item, (res) => {
                            if (res.Result == '0') {
                                this.fpList_ErrList.push({
                                    FPHM: this.fpSelectBPMList.find((e) => {
                                        console.log('e.FPID', e.FPID)
                                        return e.FPID == FPID
                                    })?.FPHM,
                                    Message: res.Message ?? '未知'
                                })
                            }
                            resolve(res)
                        });
                    })
                );
            }
        }
        Promise.all(promises)
            .then((res) => {
                if (this.fpList_ErrList.length > 0) {
                    startFname(['aModel_1722590219999', 'errListOpen'], JSON.parse(JSON.stringify(this.fpList_ErrList)))
                }

                if (this.fpList_ErrList.length === 0) {
                    funName('successMessage', '保存成功')
                    startFname(['aModel_1716961873380', 'fpListClose'], '')
                    startFname(['flexBox_1682238164546', 'closeAdd'], '')
                }

                startFname(['foldersList_1682246496157', 'loadList'], '')
            }).catch((err) => {
                funName('errorMessage', '保存失败')
                console.warn('err', err);
            })
    }
},
errListOpenCB([key, list]){
    startFname(['tableBox_1722590228682', 'setLoadList'], { rows: list })
},
fpDelete([key, item]){// 删除发票
    if (item) confirm('确认删除', '确定是否删除此发票？', 'fpDeleteOK', item)
},
fpDeleteOK([key, item]){
    postFormAction('/NEWKP/CWAPI/SCFP', { FPID: item.FPID }, (res) => {
        if (res.Result == '1') {
            funName('successMessage', res.Message)
            startFname(['foldersList_1682246496157', 'loadList'], '')
        } else {
            funName('errorMessage', res.Message)
        }
        if (res.ErrList && res.ErrList.length > 0) {
            funName('closeError', res.ErrList)
        }
    })
},
FPMX_show([key, item]) {// 查看明细
    const postData = { FPID: item.FPID };
    if (item.FPMXLIST) {
        this.handleFPMX(item.FPMXLIST, item.FPZL);
    } else {
        postFormAction('/NEWKP//SJJX/FPMX', postData, (res) => {
            if (res.Result === '1') {
                this.handleFPMX(res.rows, res.rows[0].FPZL);
            }
        });
    }
},
handleFPMX(rows, fpzl) {
    const modelId = fpzl === '41' ? 'aModel_1722493524399' : 'aModel_1727603659996';
    startFname([modelId, 'fpmxOpen'], { rows: rows });
},
fpmxOpenCB([key, res]) {
    const fpzl = res.rows[0].FPZL;
    const targetTableId = fpzl === '41' ? 'tableBox_1722493529991' : 'tableBox_1727603670229';
    startFname([targetTableId, 'setLoadList'], res);
},
fpmx_item_add() {
    const list = startFname(['tableBox_1722493529991', 'getLoadList']);
    list.push({
        MXXH: list[list.length - 1].MXXH + 1,
        CPMC: '',
        CPXH: '',
        CPDW: '',
        CPSL: '',
        CPDJ: '',
        BHSJE: '',
        SL: '',
        SE: ''
    });
    startFname(['tableBox_1722493529991', 'setLoadList'], { rows: list });
},
fpmx_item_del([key, item, index]) {
    confirm('删除提醒', '确认是否删除明细？', () => {
        const list = startFname(['tableBox_1722493529991', 'getLoadList']);
        list.splice(index, 1);
        startFname(['tableBox_1722493529991', 'setLoadList'], { rows: list });
    }, index);
},
fpmx_item_save() {
    const list = startFname(['tableBox_1722493529991', 'getLoadList']);
    const encodedList = `[${funName('Base64Encode', list)}]`;
    startFname(['invoiceInfo_1709516607988', 'changeData'], { FPMXLIST: encodedList });
},
qxsc([key, item]){//取消上传
    if (item) confirm('取消上传', '是否取消上传此发票？', 'fpQxscOK', item)
},
fpQxscOK([key, item]){
    postFormAction('/NEWKP/CWAPI/SCFP', { FPID: item.FPID }, (res) => {
        if (res.Result == '1') {
            funName('successMessage', res.Message)
            startFname(['tableBox_1716961910787', 'setLoadList'], res[1])
        } else {
            funName('errorMessage', res.Message)
        }
        if (res.ErrList && res.ErrList.length > 0) {
            funName('closeError', res.ErrList)
        }
    })
},
fpBoxDel([key, item]){
    if (item) {
        confirm('删除提醒', `是否删除项目夹 '${item.QRXM}' 及其包含的所有发票？ （注意:删除后不可恢复）`, (item) => {
            postFormAction('/newkp/CWAPI/XMSC', { xmid: item.XMID }, (res) => {
                if (res.Result == '1') {
                    funName('successMessage', res.Message)
                    startFname(['foldersList_1682246496157', 'loadList'], '')
                } else {
                    funName('errorMessage', res.Message)
                }
            })
        }, item)
    }
},
addImg([key, item]){//追加发票图片
    //OVERORADD,有传值才会显示选择
    const allowedFPZLValues = ['026', '028', '007', '004', '021', '020', '42', '43', '14', 'szqkl', '90', '901', '902', '903', '904', '905'];

    if (!allowedFPZLValues.includes(item.FPZL)) {
        funName('errorMessage', '此发票不支持追加发票图片');
        return;
    }
    let params = {
        FPID: item.FPID,
        OVERORADD: '1',//是追加还是覆盖，当传值OVER时为覆盖，其他值为追加。
    }
    startFname(['upLoadInvoice_1729678688106', 'addImg_open'], [params, 'fg'])//'fg'覆盖,'hb'合并
},
addImg_CB([key, res]){//追加发票图片回调
    if (res.Result == '1') startFname(['foldersList_1682246496157', 'loadList'], '')
},
foldersList_tryAgain([key, item]){//重新查验
    funName('successMessage', '查验中...')
    if (item.MXDQ == 0) {
        let fpzl = item.YFPZL || item.FPZL;
        let tsFPZL = ['szqkl']
        if (tsFPZL.includes(fpzl)) {
            fpzl = item.FPZL;
        }

        let postData = {
            FPID: item.FPID,
            MXDQ: 0,
            FPZL: fpzl,
            FPDM: item.FPDM12 || '',
            FPHM: item.FPHM8 || '',
            KPRQ: item.KPRQ || '',
        }
        // 004纸质专票, 007纸质专票, 008机动车, 020数电专票, 021数电普票, 022数电纸质专票, 023数电纸质普票 026电子普票, 028电子专票
        let JSHJ_FPZL = ['020', '021', '022', '023'];
        let JYM_FPZL = ['004', '007', '026', '028'];
        if (JSHJ_FPZL.includes(fpzl)) {
            postData.JSHJ = item.JSHJ || '';
        } else if (JYM_FPZL.includes(fpzl)) {
            postData.JYM = item.JYM || '';
        } else if (fpzl == '008') {
            postData.KPJE = item.KPJE || '';
        } else {
            postData.JSHJ = item.JSHJ || '';//价税合计(含税)
            postData.KPJE = item.KPJE || '';//开票金额(不含税)
            postData.JYM = item.JYM || '';
        }
        // console.log('重新查验', { ...item }, { ...postData });
        postFormAction('/NEWKP/CWAPI/SGRRCYFP', postData, (res) => {
            if (res.Result == '1') {
                startFname(['foldersList_1682246496157', 'loadList'], '')
                funName('successMessage', res.Message)
            } else {
                item.isEditMode = true;
                startFname(['invoiceInfo_1733899013599', 'openCyjg'], item)
                funName('errorMessage', res.Message)
            }
        })
    } else {
        funName('warningMessage', '无需查验')
    }
},
xmHide([key, item]){// 文件夹的隐藏与显示
    confirm(`项目${item.XMZT == '1' ? '显示' : '隐藏'}提醒`, `确认是否${item.XMZT == '1' ? '显示' : '隐藏'}项目？`, (item) => {
        // xmzt:表示项目隐藏状态，0=不隐藏;1=隐藏；
        postFormAction('/newkp/CWAPI/XZXM', { xmid: item.XMID, xmzt: item.XMZT == '1' ? '0' : '1' }, (res) => {
            if (res.Result == '1') {
                funName('successMessage', res.Message)
                startFname(['foldersList_1682246496157', 'loadList'], '')
            } else {
                funName('errorMessage', res.Message)
            }
        })
    }, item);
},
fp_move([key, item]){//发票转移
    let list = []
    if (item) {
        list = [item]
    } else {
        list = startFname(['foldersList_1682246496157', 'getCheck'])
        if (list.length === 0) {
            return funName('warningMessage', '请选择要转移的发票')
        }
    }
    startFname(['aModel_1740123614053', 'fp_move_open'], list)
},
fp_move_commit: async function([key, list]) {//发票转移弹框确认
    let values = await handleGetData();
    if (!values.new_xmid) return
    window.loading();
    let postData = {
        oldxmid: localStorage.getItem('XMID'),
        newxmid: values.new_xmid,
        fpid: list.map(item => item.FPID).join(','),
    }
    postFormAction('/newkp/CWAPI/XZXMByXXFP', postData, (res) => {
        window.loadingOk();
        if (res.Result == '1') {
            funName('successMessage', res.Message)
            startFname(['foldersList_1682246496157', 'loadList'], '')
        } else {
            funName('errorMessage', res.Message)
        }
    })
},
//批量修改费用类别
plxgfylb: function(res) {
    let checkList = getValue("tableBox_1716961910787");
    console.log('qxRzgxcheckList', checkList)
    this.fpSelect = checkList;
    this.operationType = 'plxgfylb';
    if (checkList.length > 0) {
        startFname(['aModel_1716340037568', 'BPMOpen'], checkList)
    } else {
        funName('warningMessage', '请至少选中一条数据');
    }
},
xgfylb: function(res) {
    let checkList = startFname(['foldersList_1682246496157', 'getCheck'], '')
    console.log('xgfylbcheckList', checkList)
    this.fpSelect = checkList;
    this.operationType = 'xgfylb';
    if (checkList.length > 0) {
        startFname(['aModel_1716340037568', 'BPMOpen'], res)
    } else {
        funName('warningMessage', '请至少选中一条数据');
    }
},



