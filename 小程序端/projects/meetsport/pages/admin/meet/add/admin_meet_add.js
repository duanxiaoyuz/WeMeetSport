const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const dataHelper = require('../../../../../../helper/data_helper.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js'); 
const validate = require('../../../../../../helper/validate.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const projectSetting = require('../../../../public/project_setting.js');
const MeetBiz = require('../../../../biz/meet_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.MEET_NAME + '-添加',
		});

		this.setData(AdminMeetBiz.initFormData());
		this.setData({
			isLoad: true
		});
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	url: function (e) {
		pageHelper.url(e, this);
	},
	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	},

	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;
		data = validate.check(data, AdminMeetBiz.CHECK_FORM, this);
		if (!data) return;
 

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;

		data.forms = JSON.stringify(forms);
		data.obj = JSON.stringify(dataHelper.dbForms2Obj(forms));
		data.cateName = MeetBiz.getCateName(data.cateId);

		try {

			// 创建
			let result = await cloudHelper.callCloudSumbit('admin/meet/insert', data);


			let callback = async function () {
				PublicBiz.removeCacheList('admin-meet-list');
				PublicBiz.removeCacheList('meet-list');
				wx.navigateBack();

			}
			pageHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}
	}, 
})