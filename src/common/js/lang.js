import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export const messages = {
    en: {
        lang: 'English',
        data: {
            loading: 'loading...',
            none: 'no data',
            input: 'Please enter data',
            int: 'Please enter integer',
            empty: 'Require'
        },
        oper: {
            oper: 'Operation',
            record: 'Record',
            edit: 'Edit',
            stop: 'Stop',
            delete: 'Delete'
        },
        login: {
            title: 'Login promotion statistics platform',
            loadingText: 'Logging...',
            placeholder: {
                username: 'please input your account',
                password: 'Please enter your password'
            },
            enter: 'Login',
            error: {
                username: 'The username cannot be empty',
                illegal: 'Illegal character',
                password: 'Password cant be empty',
                format: 'The format is incorrect'
            },
            logout: 'logout'
        },
        accountList: {
            label: {
                name: "username",
                role: "manage level",
                platform: 'platform',
                oper: 'operation',
                edit: 'edit'
            },
            error: {
                edit: 'You cannot modify this account!'
            }
        },
        role: {
            admin: 'Promoter',
            manage: 'Manager'
        },
        statis: {
            singleTitle: 'All record details for a single subject',
            totalTitle: 'A recent record form for all subjects',
            tip: 'Click here for details',
            oper: {
                findRecordsBySid: 'View all records under this subject'
            },
            label: {
                content: 'Subject content',
                product: 'Related product',
                channel: 'Related channel',
                link: 'Related links',
                registerTime: 'Publish date',
                index: 'Order',
                readCount: 'Pageviews',
                showCount: 'Collections',
                relayCount: 'Forwardings',
                commontCount: 'Comments',
                thumbsCount: 'Thumbs up',
                time: 'Recent record time',
                laterTime: 'Record time'
            },
            placeholder: {
                searchSubject: 'Search subject',
                selectType: 'Select the query type',
            },
            searchFields: {
                sid: 'Subject number',
                content: 'content',
                product: 'product',
                link: 'link'
            },
            submit: {
                title: 'The final submission of the day is accurate',
                submited: 'Submited',
                no: 'Submited'
            },
            success: {
                record: 'Record successfully'
            },
            error: {
                noSelected: 'Unselected'
            }
        },
        search: {
            label: {
                sc: 'Select channels',
                sp: 'Select product',
                sd: 'Select date range'
            },
            placeholder: {
                stc: 'Select top channels',
                ssc: 'Select secondary channels',
                select: 'Searchable',
                start: 'start date',
                end: 'end date'
            },
            select: {
                loading: 'loading',
                pstc: 'Please select the top channel first',
                title: 'Secondary channels were chosen to search only by secondary channels'
            },
            pickOptions: {
                week: 'last week',
                month: 'Last month',
                threeM: 'Last three months'
            }
        },
        subject: {
            label: {
                id: 'Subject ID',
                sid: 'Subject number',
                pc: 'Parent channel',
                link: 'Related links',
                time: "Registration date",
                none: 'No record',
                hasRecordToday: 'Its been recorded today',
                noRecord1: '',
                noRecord2: ' day(s) has not been recorded'
            },
            oper: {
                record: 'Record',
                edit: 'Edit',
                stop: 'Stop',
                upload: 'Upload',
                delete: 'Delete'
            },
            placeholder: {
                content: 'Fill in the promotion content',
                link1: 'Fill in a link about',
                link2: '',
                st: 'Select time'
            },
            add:{
                success: 'Added successfully',
                error: 'Added failed',
            },
            error: {
                channel: 'Wrong channel data'
            }
        },
        submit: {
            save: 'save',
            working: 'processing...'
        },
        product: {
            label: {
                id: 'Product ID',
                name: 'Product Name',
                category: 'Category',
                desc: 'Remark'
            },
            delete: {
                disabled: 'You cannot delete products that are not added by you!',
                success: 'Deleted successfully!',
                error: 'Delete failed!',
                confirm: 'This operation will permanently delete the product. Will it continue?',
                tip: 'Tip',
                sure: 'Ensure',
                cancel: 'cancel',
                canceled: 'This delete action has been canceled'
            },
            placeholder: {
                product: 'Fill in the only product name',
                category: 'Select category',
                desc: 'Remark'
            },
            loading: {
                add: 'Trying to add..'
            },
            add: {
                product: 'The product name already exists',
                success: 'Added successfully',
                error: 'Added failed',
            },
            edit: {
                success: 'Edited successfully',
                error: 'Edited failed'
            }
        },
        channel: {
            label: {
                name: 'Channel',
                desc: 'Description',
                fans: 'Follower',
                input: 'Has invested(RMB)',
            },
            oper: {
                addChildren: 'Add sublevel channels'
            },
            delete: {
                disabled: 'You cannot delete channels that are not added by you!',
                success: 'Deleted successfully!',
                error: 'Delete failed!',
                confirm: 'This operation will permanently delete the channel. Will it continue?',
                tip: 'Tip',
                sure: 'Ensure',
                cancel: 'cancel',
                canceled: 'This delete action has been canceled'
            },
            loading: {
                add: 'Trying to add..'
            },
            add: {
                label: {
                    st: 'Select classification',
                    tc: 'Top channel',
                    fans: 'Follower',
                    name: 'Channel name:',
                    input: 'Has invested:',
                    desc: 'Description:'
                },
                placeholder: {
                    pid: 'Select channel classification, not choose as the top channel to add',
                    name: 'Fill in channel name',
                    fans: 'Fill in follower count',
                    input: 'Fill in the invested capital',
                    desc: 'Short description'
                },
                message: {
                    success: 'Added channel successfully',
                    error: 'Added channel failed',
                }
            },
            edit: {
                message: {
                    success: 'Edited successfully',
                    error: 'Edited failed',
                }
            }
        },
        ...enLocale
    },
    'zh-cn': {
        lang: '中文',
        data: {
            loading: '正在找（～￣▽￣～）',
            none: '没东西╮(╯▽╰)╭',
            input: '请输入数据',
            int: '请输入整数',
            empty: '不能为空'
        },
        oper: {
            oper: '操作',
            record: '记录',
            edit: '修改',
            stop: '停用',
            delete: '删除'
        },
        login: {
            title: '登录推广统计平台',
            loadingText: '正在登录中...',
            placeholder: {
                username: '请输入帐户名',
                password: '请输入密码'
            },
            enter: '登录',
            error: {
                username: '用户名不能为空',
                illegal: '有非法字符',
                password: '密码不能为空',
                format: '填写格式不正确'
            },
            logout: '退出'
        },
        accountList: {
            label: {
                name: "用户名",
                role: "权限等级",
                platform: '部门',
                oper: '操作',
                edit: '修改'
            },
            error: {
                edit: '该账户您不可进行修改！'
            }
        },
        role: {
            admin: '推广员',
            manage: '管理员'
        },
        statis: {
            singleTitle: '单个主题的所有记录详情',
            totalTitle: '所有主题的最近记录表格',
            tip: '点击查看详情',
            oper: {
                findRecordsBySid: '查看该主题下的所有记录'
            },
            label: {
                content: '推广内容',
                product: '推广产品',
                channel: '相关渠道',
                link: '相关链接',
                registerTime: '发布时间',
                index: '序号',
                readCount: '阅读量',
                showCount: '收藏量',
                relayCount: '转发量',
                commontCount: '评论量',
                thumbsCount: '点赞量',
                time: '记录时间',
                laterTime: '最近记录时间'
            },
            placeholder: {
                searchSubject: '搜索需要添加记录的主题',
                selectType: '选择查询类目',
            },
            searchFields: {
                sid: '主题号',
                content: '内容',
                product: '产品',
                link: '链接'
            },
            submit: {
                title: '一天内以最后一次提交为准',
                submited: '已提交',
                no: '提交'
            },
            success: {
                record: '记录成功'
            },
            error: {
                noSelected: '未选择'
            }
        },
        search: {
            label: {
                sc: '选择渠道',
                sp: '选择产品',
                sd: '选择时间段'
            },
            placeholder: {
                stc: '选择顶级渠道',
                ssc: '选择次级渠道',
                select: '可输入进行搜索',
                start: '开始日期',
                end: '结束日期'
            },
            select: {
                loading: '加载中',
                pstc: '请先选择顶级渠道',
                title: '选择了次级渠道则只按次级渠道进行搜索'
            },
            pickOptions: {
                week: '最近一周',
                month: '最近一个月',
                threeM: '最近三个月'
            }
        },
        subject: {
            label: {
                id: '主题id',
                sid: '主题号',
                pc: '父级渠道',
                link: '相关链接',
                time: "发布时间",
                none: '暂无记录',
                hasRecordToday: '今天已做记录',
                noRecord1: '已有',
                noRecord2: '天未记录'
            },
            oper: {
                record: '记录',
                edit: '修改',
                upload: '截图',
                stop: '停用',
                start: '启用',
                delete: '删除'
            },
            edit:{
                confirm: '确认修改？此操作不会删除相应的记录'
            },
            placeholder: {
                content: '填写推广内容',
                link1: '填写',
                link2: '相关的链接',
                st: '选择时间'
            },
            add: {
                success: '添加成功',
                error: '添加失败',
            },
            error: {
                channel: '渠道数据有误'
            }
        },
        submit: {
            save: '保存',
            working: '正在处理...'
        },
        product: {
            label: {
                id: '产品编号',
                name: '产品名',
                category: '类别',
                desc: '备注'
            },
            delete: {
                disabled: '该产品不是您添加的，不可删除！',
                success: '删除成功!',
                error: '删除失败!',
                confirm: '此操作将永久删除该产品, 是否继续?',
                tip: '提示',
                sure: '确定',
                cancel: '取消',
                canceled: '已取消删除'
            },
            placeholder: {
                product: '填写唯一的产品名',
                category: '选择产品类别',
                desc: '备注'
            },
            loading: {
                add: '正在努力添加..'
            },
            add: {
                product: '已存在该产品名',
                success: '添加成功',
                error: '添加失败',
            },
            edit: {
                success: '修改成功',
                error: '修改失败'
            }
        },
        channel: {
            label: {
                name: '平台',
                desc: '描述',
                fans: '关注人数',
                input: '已投入(RMB)',
            },
            oper: {
                addChildren: '添加子级渠道'
            },
            delete: {
                disabled: '该渠道不是您添加的，不可删除！',
                success: '删除成功!',
                error: '删除失败!',
                confirm: '此操作将永久删除该渠道, 是否继续?',
                tip: '提示',
                sure: '确定',
                cancel: '取消',
                canceled: '已取消删除'
            },
            loading: {
                add: '正在努力添加..'
            },
            add: {
                label: {
                    fans: '关注人数',
                    st: '选择分类',
                    tc: '顶级渠道',
                    name: '渠道名:',
                    input: '已投入:',
                    desc: '描述:'
                },
                placeholder: {
                    pid: '选择渠道分类，不选择则作为顶级渠道添加',
                    name: '填写渠道名',
                    fans: '填写关注人数',
                    input: '填写已投入资金',
                    desc: '简短的描述'
                },
                message: {
                    success: '添加渠道成功',
                    error: '添加失败',
                }
            },
            edit: {
                message: {
                    success: '修改成功',
                    error: '修改失败',
                }
            }
        },
        store:{
            label:{
                id: '店铺id',
                name: '店铺名',
                link: '首页链接',
                platform: '所属平台',
                owner: '负责人',
                desc: '简介'
            }
        },

        ...zhLocale
    }
}
