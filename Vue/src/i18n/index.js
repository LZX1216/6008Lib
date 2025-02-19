import {createI18n} from 'vue-i18n'

const messages = {
    zh: {
        common: {
            search: '搜索',
            login: '登录',
            register: '注册',
            logout: '退出登录',
            confirm: '确定',
            cancel: '取消',
            submit: '提交',
            reset: '重置',
            remove: '删除',
        },
        nav: {
            home: '首页',
            books: '图书',
            about: '关于我们',
            contact: '联系我们',
            help: '帮助支持',
            goToAdminOverview: '前往管理员主页',
        },
        homepage: {
            welcomeToTheLibrary: '欢迎来到图书馆',
            discoverKnowledge: '发现知识的海洋',
            recentEvents: '最近活动',
            popularBooks: '热门图书',
            newArrivals: '新书上架',
            recommendedForYou: '为您推荐',
        },
        search: {
            searchBooks: '搜索图书',
            searchByTitle: '按书名搜索...',
            searchByAuthor: '按作者搜索...',
            searchByISBN: '按ISBN搜索...',
        },
        book: {
            id: 'ID',
            title: '书名',
            author: '作者',
            publisher: '出版社',
            isbn: 'ISBN',
            publishDate: '出版日期',
            description: '简介',
            category: '分类',
            location: '位置',
            callNumber: '索书号',
            availableCopies: '可借数量',
            totalCopies: '总数量',
            rating: '评分',
            comment: '评论',
            publicationYear: '出版年份',
            commentCount: '评论数量',
            cover: '封面',
        },
        bookList: {
            pageTitle: '📚 图书',
            filterBy: '筛选',
            advancedFilters: '🔍 高级筛选',
            sortBy: '排序',
            selectSortOption: '选择排序选项',
            order: '顺序',
            ascending: '升序',
            descending: '降序',
            ratingRange: '评分范围',
            yearRange: '出版年份范围',
            selectLanguage: '选择语言',
            popularTags: '热门标签',
            resetAll: '重置所有',
            list: '书单',
            detail: '详情',
            actions: '操作',
            addToList: '加入书单',
            viewDetails: '查看详情'
        },
        user: {
            profile: '个人资料',
            borrowing: '当前借阅',
            history: '借阅历史',
            wishlist: '我的书单',
            settings: '账户设置'
        },
        bookDetail: {
            borrow: '借阅',
            borrowed: '已借出',
            addToList: '加入书单',
            similarBooksTitle: '相似书籍',
            descriptionTitle: '简介',
            libraryInfoTitle: '图书馆信息',
            commentsTitle: '评论',
            writeCommentTitle: '写评论',
            commentPlaceholder: '请分享你对这本书的看法...',
            ratingRequired: '请提供评分',
            commentRequired: '请输入你的评论',
            commentMinLength: '评论至少需要10个字符',
            borrowConfirm: '你确定要借阅这本书吗？',
            borrowConfirmationTitle: '借阅确认',
            borrowSuccess: '借阅成功',
            borrowCancel: '借阅已取消',
            addToWishlistSuccess: '已添加到你的书单',
            commentSubmitSuccess: '评论提交成功'
        },
        aboutUs: {
            title: '关于我们',
            introduction: '我们是一家现代化图书馆，致力于为读者提供高品质的阅读体验和知识服务。自2020年成立以来，我们不断创新服务模式，融合传统与现代管理方式。',
            missionTitle: '我们的使命',
            mission: '传播知识，促进学习，服务社会，推动文化发展。',
            visionTitle: '我们的愿景',
            vision: '成为最受欢迎的现代化智能图书馆，为读者提供卓越的阅读体验和知识服务。',
            featuresTitle: '我们的特色',
            featureRichCollection: {
                title: '丰富馆藏',
                description: '超过10万册图书和丰富的电子资源'
            },
            featureSmartBorrowing: {
                title: '智能借阅',
                description: '24小时自助借阅和在线预约'
            },
            featureProfessionalService: {
                title: '专业服务',
                description: '专业图书馆员提供参考咨询服务'
            },
            statsTitle: '图书馆概况',
            stats: {
                booksInCollection: '馆藏图书',
                registeredReaders: '注册读者',
                annualLoans: '年借阅量',
                electronicResources: '电子资源'
            },
            contactTitle: '联系信息',
            address: '地址：新加坡某地',
            phone: '电话：+65 1234 5678',
            email: '邮箱：library@example.com',
            openingHoursTitle: '开放时间',
            openingHoursMonFri: '周一至周五：8:00 - 22:00',
            openingHoursSatSun: '周六和周日：9:00 - 21:00',
            openingHoursPublicHolidays: '公共节假日：9:00 - 17:00'
        },
        helpSupport: {
            faqTitle: '常见问题解答',
            purchaseRequestTitle: '图书采购申请',
            submitPurchaseRequest: '提交采购申请',
            title: '书名',
            author: '作者',
            isbn: 'ISBN',
            requestDate: '申请日期',
            status: '状态',
            contactUsTitle: '联系我们',
            name: '姓名',
            email: '邮箱',
            subject: '主题',
            message: '留言内容',
            submit: '提交',
            reset: '重置',
            selectSubject: '请选择一个主题',
            borrowingIssues: '借阅问题',
            accountIssues: '账户问题',
            technicalSupport: '技术支持',
            other: '其他',
            describeIssue: '请详细描述您的问题...',
            submitPurchaseRequestTitle: '提交采购申请',
            publisher: '出版社',
            publishDate: '出版日期',
            reason: '推荐理由',
            explainReason: '请说明您推荐这本书的原因...',
            cancel: '取消',
            submitRequest: '提交申请',
            nameRequired: '请输入您的姓名',
            nameLength: '长度应在2到20个字符之间',
            emailRequired: '请输入您的邮箱地址',
            validEmail: '请输入有效的邮箱地址',
            selectSubjectRequired: '请选择一个主题',
            messageRequired: '请输入您的留言内容',
            messageMinLength: '留言内容至少需要10个字符',
            titleRequired: '请输入书名',
            authorRequired: '请输入作者',
            isbnRequired: '请输入ISBN',
            reasonRequired: '请输入推荐理由',
            reasonMinLength: '推荐理由至少需要20个字符',
            messageSent: '留言已发送，我们将尽快回复您！',
            pending: '待处理',
            approved: '已批准',
            rejected: '已拒绝',
            purchased: '已采购',
            pleaseLogin: '请先登录',
            purchaseRequestSubmitted: '采购申请提交成功',
            faq1Question: '如何借阅图书？',
            faq1Answer: '登录后，您可以在图书详情页面点击“借阅”按钮进行借阅。每人每次最多可借阅5本图书，借阅期限为30天。',
            faq2Question: '如何续借图书？',
            faq2Answer: '在“我的借阅”页面，您可以对未逾期的图书进行续借。每本图书最多可续借2次，每次续借可延长借阅期限30天。',
            faq3Question: '如果我忘记归还图书会怎样？',
            faq3Answer: '逾期图书将产生0.5元/本/天的罚款。同时也会影响您的信用分数，可能限制您未来的借阅权限。'
        },
        login: {
            welcomeBack: '欢迎回来',
            pleaseSignIn: '请登录您的账户',
            usernamePlaceholder: '用户名',
            passwordPlaceholder: '密码',
            signIn: '登录',
            forgotPassword: '忘记密码？',
            dontHaveAccount: '还没有账户？',
            signUp: '注册',
            usernameRequired: '请输入用户名',
            passwordRequired: '请输入密码',
            loginSuccess: '登录成功',
            loginFailed: '用户名或密码错误',
            contactAdmin: '请联系管理员'
        },
        register: {
            createAccount: '创建账户',
            joinCommunity: '立即加入我们的社区',
            usernamePlaceholder: '用户名',
            passwordPlaceholder: '密码',
            confirmPasswordPlaceholder: '确认密码',
            register: '注册',
            alreadyHaveAccount: '已有账户？',
            signIn: '登录',
            usernameRequired: '请输入用户名',
            passwordRequired: '请输入密码',
            confirmPasswordRequired: '请确认你的密码',
            passwordMismatch: '两次输入的密码不匹配！',
            registrationFailedLog: '注册失败：',
            registrationFailed: '注册失败，请重试。'
        },
        userCenter: {
            roleSuperAdmin: '超级管理员',
            roleAdmin: '管理员',
            roleUser: '用户',
            currentBorrowings: '当前借阅数量',
            borrowingHistory: '借阅历史数量',
            overdueCount: '逾期数量',
            borrowingRecordsTitle: '借阅记录',
            borrowDate: '借阅日期',
            dueDate: '应归还日期',
            actualReturnDate: '实际归还日期',
            status: '状态',
            myWishlistTitle: '我的书单',
            dateAdded: '添加日期',
            actions: '操作',
            borrow: '借阅',
            remove: '移除',
            borrowingStatus: '借阅中',
            returnedStatus: '已归还',
            renewConfirmMessage: '你确定要续借这本书吗？',
            renewConfirmationTitle: '续借确认',
            renewalSuccess: '续借成功',
            renewalCancelled: '续借已取消',
            borrowConfirmMessage: '你确定要借阅这本书吗？',
            borrowConfirmationTitle: '借阅确认',
            bookBorrowedSuccessfully: '书籍借阅成功',
            borrowingCancelled: '借阅已取消',
            borrowFromWishlistConfirmMessage: '你确定要从你的书单中借阅这本书吗？',
            bookNotAvailable: '这本书目前不可借阅。',
            removeFromWishlistConfirmMessage: '你确定要从你的书单中移除这本书吗？',
            removeConfirmationTitle: '移除确认',
            removedFromWishlist: '已从书单中移除',
            removalCancelled: '移除已取消'
        },
        logout: {
            confirmMessage: '你确定要退出登录吗？',
            warningTitle: '警告',
            successMessage: '退出登录成功',
            cancelMessage: '退出登录已取消'
        },
        adminDashboard: {
            title: '管理面板',
            overview: '概览',
            bookManagement: '图书管理',
            userManagement: '用户管理',
            borrowManagement: '借阅管理'
        },
        adminOverview: {
            totalBorrows: '总借阅量',
            activeUsers: '活跃用户',
            newBooks: '新书数量',
            overdueBooks: '逾期书籍',
            active: '活跃',
            growing: '增长中',
            thisMonth: '本月',
            attention: '需关注',
            borrowingTrend: '借阅趋势',
            week: '周',
            month: '月',
            year: '年',
            bookCategoryStatistics: '书籍类别统计',
            recentActivities: '近期活动',
            userReturnedBook: '用户 {user} 归还了 "{book}"',
            newBookAdded: '新书 "{book}" 已加入库存',
            userLoanOverdue: '用户 {user} 的借阅已逾期',
            mon: '周一',
            tue: '周二',
            wed: '周三',
            thu: '周四',
            fri: '周五',
            sat: '周六',
            sun: '周日',
            week1: '第1周',
            week2: '第2周',
            week3: '第3周',
            week4: '第4周',
            jan: '一月',
            feb: '二月',
            mar: '三月',
            apr: '四月',
            may: '五月',
            jun: '六月',
            jul: '七月',
            aug: '八月',
            sep: '九月',
            oct: '十月',
            nov: '十一月',
            dec: '十二月',
        },
        adminBookManagement: {
            bookManagement: '图书管理',
            addNewBook: '添加新书',
            viewPurchaseRequests: '查看采购申请',
            searchBooks: '搜索图书...',
            borrowStatus: '借阅状态',
            all: '全部',
            available: '可借',
            borrowed: '已借出',
            status: '状态',
            actions: '操作',
            edit: '编辑',
            delete: '删除',
            editBook: '编辑图书',
            selectDate: '选择日期',
            enterCoverImageUrl: '输入封面图片链接',
            purchaseRequests: '采购申请',
            requestDate: '申请日期',
            approve: '批准',
            reject: '拒绝',
            pleaseEnterTitle: '请输入书名',
            pleaseEnterAuthor: '请输入作者',
            pleaseEnterIsbn: '请输入ISBN',
            confirmDeleteBook: '你确定要删除这本书吗？',
            warning: '警告',
            deletedSuccessfully: '删除成功',
            failedToDelete: '删除失败',
            addedSuccessfully: '添加成功',
            updatedSuccessfully: '更新成功',
            confirmApproveRequest: '你确定要批准这个申请吗？',
            confirmApproval: '确认批准',
            purchaseRequestApproved: '采购申请已批准',
            failedToApproveRequest: '批准申请失败',
            confirmRejectRequest: '你确定要拒绝这个申请吗？',
            confirmRejection: '确认拒绝',
            purchaseRequestRejected: '采购申请已拒绝',
            failedToRejectRequest: '拒绝申请失败',
            pending: '待处理',
            approved: '已批准',
            rejected: '已拒绝'
        },
        adminUserManagement: {
            userManagement: "用户管理",
            searchUsers: "搜索用户...",
            userStatus: "用户状态",
            all: "全部",
            active: "活跃",
            disabled: "禁用",
            id: "ID",
            username: "用户名",
            name: "姓名",
            role: "角色",
            administrator: "管理员",
            superAdmin: "超级管理员",
            user: "普通用户",
            status: "状态",
            currentBorrows: "当前借阅数",
            totalBorrows: "总借阅数",
            overdueTimes: "逾期次数",
            actions: "操作",
            disable: "禁用",
            enable: "启用",
            resetPassword: "重置密码",
            demote: "降级",
            promote: "升级",
            userDetails: "用户详情",
            basicInformation: "基本信息",
            borrowingStatistics: "借阅统计",
            confirmAction: "你确定要 {action} 此用户吗？",
            warning: "警告",
            actionSuccess: "{action} 成功",
            actionFailed: "无法 {action}",
            confirmResetPassword: "你确定要重置此用户的密码吗？",
            resetPasswordSuccess: "密码重置成功，新密码已发送至用户邮箱",
            resetPasswordFailed: "密码重置失败",
            roleUpdated: "用户角色已更新为 {role}"
        },
        adminBorrowManagement: {
            borrowManagement: "借阅管理",
            searchBooksOrUsers: "搜索书籍...",
            borrowStatus: "借阅状态",
            all: "全部",
            borrowing: "借阅中",
            returned: "已归还",
            overdue: "逾期",
            startDate: "开始日期",
            endDate: "结束日期",
            borrowId: "借阅 ID",
            book: "书籍",
            borrower: "借阅者",
            borrowDate: "借阅日期",
            dueDate: "应归还日期",
            actualReturnDate: "实际归还日期",
            status: "状态",
            actions: "操作",
            confirmReturn: "确认归还",
            handleOverdue: "处理逾期",
            borrowInformation: "借阅信息",
            handleMethod: "处理方式",
            fine: "罚款",
            warning: "警告",
            confirm: "确认",
            addToBlacklist: "加入黑名单",
            fineAmount: "罚款金额",
            remarks: "备注",
            confirmReturnMessage: "你确定这本书已归还吗？",
            returnConfirmedSuccessfully: "归还确认成功",
            failedToConfirmReturn: "无法确认归还",
            handledSuccessfully: "处理成功",
            failedToHandle: "处理失败",
            overdueDays: "逾期天数"
        },
        footer: {
            libraryTitle: '图书馆',
            libraryAddress: '新加坡某地',
            copyright: '© {year} 图书馆系统。保留所有权利。',
            quickLinksTitle: '快速链接',
            contactUsTitle: '联系我们',
            contactPhone: '+65 1234 5678',
            contactEmail: 'library@library.com'
        }
    },
    en: {
        common: {
            search: 'Search',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            confirm: 'Confirm',
            cancel: 'Cancel',
            submit: 'Submit',
            reset: 'Reset',
        },
        nav: {
            home: 'Home',
            books: 'Books',
            about: 'About Us',
            contact: 'Contact',
            help: 'Help & Support',
            goToAdminOverview: 'Go to Admin Overview',
        },
        homepage: {
            welcomeToTheLibrary: 'Welcome to the Library',
            discoverKnowledge: 'Discover the Ocean of Knowledge',
            recentEvents: 'Recent Events',
            popularBooks: 'Popular Books',
            newArrivals: 'New Arrivals',
            recommendedForYou: 'Recommended For You',
        },
        search: {
            searchBooks: 'Search Books',
            searchByTitle: 'Search by Title...',
            searchByAuthor: 'Search by Author...',
            searchByISBN: 'Search by ISBN...',
        },
        book: {
            id: 'ID',
            title: 'Title',
            author: 'Author',
            publisher: 'Publisher',
            isbn: 'ISBN',
            publishDate: 'Publish Date',
            description: 'Description',
            category: 'Category',
            location: 'Location',
            callNumber: 'Call Number',
            availableCopies: 'Available Copies',
            totalCopies: 'Total Copies',
            rating: 'Rating',
            comment: 'Comment',
            publicationYear: 'Publication Year',
            commentCount: 'Comment Count',
            cover: 'Cover',
        },
        user: {
            profile: 'Profile',
            borrowing: 'Current Borrows',
            history: 'Borrow History',
            wishlist: 'My Lists',
            settings: 'Account Settings'
        },
        bookList: {
            pageTitle: '📚 Books',
            filterBy: 'Filter by',
            advancedFilters: '🔍 Advanced Filters',
            sortBy: 'Sort By',
            selectSortOption: 'Select Sort Option',
            order: 'Order',
            ascending: 'Ascending',
            descending: 'Descending',
            ratingRange: 'Rating Range',
            yearRange: 'Publication Year',
            selectLanguage: 'Select Language',
            popularTags: 'Popular Tags',
            resetAll: 'Reset All',
            list: 'List',
            detail: 'Detail',
            actions: 'Actions',
            addToList: 'Add to list',
            viewDetails: 'View Details'
        },
        bookDetail: {
            borrow: 'Borrow',
            borrowed: 'Borrowed',
            addToList: 'Add to List',
            similarBooksTitle: 'Similar Books',
            descriptionTitle: 'Description',
            libraryInfoTitle: 'Library Information',
            commentsTitle: 'Comments',
            writeCommentTitle: 'Write a Comment',
            commentPlaceholder: 'Share your thoughts on this book...',
            ratingRequired: 'Rating is required',
            commentRequired: 'Please enter your comment',
            commentMinLength: 'Comment must be at least 10 characters',
            borrowConfirm: 'Are you sure you want to borrow this book?',
            borrowConfirmationTitle: 'Borrow Confirmation',
            borrowSuccess: 'Borrowed Successfully',
            borrowCancel: 'Borrow Cancelled',
            addToWishlistSuccess: 'Added to your list',
            commentSubmitSuccess: 'Comment submitted successfully'
        },
        aboutUs: {
            title: 'About Us',
            introduction: 'We are a modern library dedicated to providing readers with high - quality reading experiences and knowledge services. Founded in 2020, we continuously innovate our service model, integrating traditional and modern management approaches.',
            missionTitle: 'Our Mission',
            mission: 'Spread knowledge, promote learning, serve society, and advance cultural development.',
            visionTitle: 'Our Vision',
            vision: 'To become the most popular modern smart library, providing readers with excellent reading experiences and knowledge services.',
            featuresTitle: 'Our Features',
            featureRichCollection: {
                title: 'Rich Collection',
                description: 'Over 100,000 books and abundant electronic resources'
            },
            featureSmartBorrowing: {
                title: 'Smart Borrowing',
                description: '24 - hour self - service borrowing and online reservation'
            },
            featureProfessionalService: {
                title: 'Professional Service',
                description: 'Professional librarians provide reference consultation services'
            },
            statsTitle: 'Library Overview',
            stats: {
                booksInCollection: 'Books in Collection',
                registeredReaders: 'Registered Readers',
                annualLoans: 'Annual Loans',
                electronicResources: 'Electronic Resources'
            },
            contactTitle: 'Contact Information',
            address: 'Address: Somewhere, Singapore',
            phone: 'Phone: +65 1234 5678',
            email: 'Email: library@example.com',
            openingHoursTitle: 'Opening Hours',
            openingHoursMonFri: 'Monday to Friday: 8:00 - 22:00',
            openingHoursSatSun: 'Saturday and Sunday: 9:00 - 21:00',
            openingHoursPublicHolidays: 'Public Holidays: 9:00 - 17:00'
        },
        helpSupport: {
            faqTitle: 'Frequently Asked Questions',
            purchaseRequestTitle: 'Book Purchase Request',
            submitPurchaseRequest: 'Submit Purchase Request',
            title: 'Title',
            author: 'Author',
            isbn: 'ISBN',
            requestDate: 'Request Date',
            status: 'Status',
            contactUsTitle: 'Contact Us',
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            submit: 'Submit',
            reset: 'Reset',
            selectSubject: 'Please select a subject',
            borrowingIssues: 'Borrowing Issues',
            accountIssues: 'Account Issues',
            technicalSupport: 'Technical Support',
            other: 'Other',
            describeIssue: 'Please describe your issue in detail...',
            submitPurchaseRequestTitle: 'Submit Purchase Request',
            publisher: 'Publisher',
            publishDate: 'Publish Date',
            reason: 'Reason',
            explainReason: 'Please explain why you recommend this book...',
            cancel: 'Cancel',
            submitRequest: 'Submit Request',
            nameRequired: 'Please enter your name',
            nameLength: 'Length should be 2 to 20 characters',
            emailRequired: 'Please enter your email address',
            validEmail: 'Please enter a valid email address',
            selectSubjectRequired: 'Please select a subject',
            messageRequired: 'Please enter your message',
            messageMinLength: 'Message must be at least 10 characters',
            titleRequired: 'Please enter the book title',
            authorRequired: 'Please enter the author',
            isbnRequired: 'Please enter the ISBN',
            reasonRequired: 'Please enter the reason for recommendation',
            reasonMinLength: 'The reason should be at least 20 characters',
            messageSent: 'Message sent, we will get back to you as soon as possible!',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            purchased: 'Purchased',
            pleaseLogin: 'Please log in first',
            purchaseRequestSubmitted: 'Purchase request submitted successfully',
            faq1Question: 'How to borrow books?',
            faq1Answer: 'After logging in, you can click the "Borrow" button on the book details page to borrow. Each person can borrow up to 5 books at a time, with a loan period of 30 days.',
            faq2Question: 'How to renew books?',
            faq2Answer: 'On the "My Borrowings" page, you can renew books that are not overdue. Each book can be renewed up to 2 times, with each renewal extending the loan period by 30 days.',
            faq3Question: 'What happens if I forget to return a book?',
            faq3Answer: 'Overdue books will incur a fine of 0.5 yuan per book per day. It will also affect your credit score and may restrict your future borrowing privileges.'
        },
        login: {
            welcomeBack: 'Welcome Back',
            pleaseSignIn: 'Please sign in to your account',
            usernamePlaceholder: 'Username',
            passwordPlaceholder: 'Password',
            signIn: 'Sign In',
            forgotPassword: 'Forgot password?',
            dontHaveAccount: "Don't have an account?",
            signUp: 'Sign up',
            usernameRequired: 'Please enter username',
            passwordRequired: 'Please enter password',
            loginSuccess: 'Login successfully',
            loginFailed: 'Incorrect username or password',
            contactAdmin: 'Please contact the administrator'
        },
        register: {
            createAccount: 'Create an Account',
            joinCommunity: 'Join our community today',
            usernamePlaceholder: 'Username',
            passwordPlaceholder: 'Password',
            confirmPasswordPlaceholder: 'Confirm Password',
            register: 'Register',
            alreadyHaveAccount: 'Already have an account?',
            signIn: 'Sign in',
            usernameRequired: 'Please enter username',
            passwordRequired: 'Please enter password',
            confirmPasswordRequired: 'Please confirm your password',
            passwordMismatch: 'The two passwords do not match!',
            registrationFailedLog: 'Registration failed:',
            registrationFailed: 'Registration failed. Please try again.'
        },
        userCenter: {
            roleSuperAdmin: 'Super Administrator',
            roleAdmin: 'Administrator',
            roleUser: 'User',
            currentBorrowings: 'Current Borrowings',
            borrowingHistory: 'Borrowing History',
            overdueCount: 'Overdue Count',
            borrowingRecordsTitle: 'Borrowing Records',
            borrowDate: 'Borrow Date',
            dueDate: 'Due Date',
            actualReturnDate: 'Actual Return Date',
            status: 'Status',
            myWishlistTitle: 'My Wishlist',
            dateAdded: 'Date Added',
            actions: 'Actions',
            borrow: 'Borrow',
            remove: 'Remove',
            borrowingStatus: 'Borrowing',
            returnedStatus: 'Returned',
            renewConfirmMessage: 'Are you sure you want to renew this book?',
            renewConfirmationTitle: 'Renew Confirmation',
            renewalSuccess: 'Renewal successful',
            renewalCancelled: 'Renewal cancelled',
            borrowConfirmMessage: 'Are you sure you want to borrow this book?',
            borrowConfirmationTitle: 'Borrow Confirmation',
            bookBorrowedSuccessfully: 'Book borrowed successfully',
            borrowingCancelled: 'Borrowing cancelled',
            borrowFromWishlistConfirmMessage: 'Are you sure you want to borrow this book from your wishlist?',
            bookNotAvailable: 'This book is not available for borrowing.',
            removeFromWishlistConfirmMessage: 'Are you sure you want to remove this book from your wishlist?',
            removeConfirmationTitle: 'Remove Confirmation',
            removedFromWishlist: 'Removed from wishlist',
            removalCancelled: 'Removal cancelled'
        },
        logout: {
            confirmMessage: 'Are you sure you want to log out?',
            warningTitle: 'Warning',
            successMessage: 'Logged out successfully',
            cancelMessage: 'Logout cancelled'
        },
        adminDashboard: {
            title: 'Admin Panel',
            overview: 'Overview',
            bookManagement: 'Book Management',
            userManagement: 'User Management',
            borrowManagement: 'Borrow Management'
        },
        adminOverview: {
            totalBorrows: 'Total Borrows',
            activeUsers: 'Active Users',
            newBooks: 'New Books',
            overdueBooks: 'Overdue Books',
            active: 'Active',
            growing: 'Growing',
            thisMonth: 'This Month',
            attention: 'Attention',
            borrowingTrend: 'Borrowing Trend',
            week: 'Week',
            month: 'Month',
            year: 'Year',
            bookCategoryStatistics: 'Book Category Statistics',
            recentActivities: 'Recent Activities',
            userReturnedBook: 'User {user} returned "{book}"',
            newBookAdded: 'New book "{book}" added to inventory',
            userLoanOverdue: 'User {user}\'s loan is overdue',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun',
            week1: 'Week 1',
            week2: 'Week 2',
            week3: 'Week 3',
            week4: 'Week 4',
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec',
        },
        adminBookManagement: {
            bookManagement: 'Book Management',
            addNewBook: 'Add New Book',
            viewPurchaseRequests: 'View Purchase Requests',
            searchBooks: 'Search Books...',
            borrowStatus: 'Borrow Status',
            all: 'All',
            available: 'Available',
            borrowed: 'Borrowed',
            status: 'Status',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            editBook: 'Edit Book',
            selectDate: 'Select Date',
            enterCoverImageUrl: 'Enter Cover Image URL',
            purchaseRequests: 'Purchase Requests',
            requestDate: 'Request Date',
            approve: 'Approve',
            reject: 'Reject',
            pleaseEnterTitle: 'Please enter the title',
            pleaseEnterAuthor: 'Please enter the author',
            pleaseEnterIsbn: 'Please enter the ISBN',
            confirmDeleteBook: 'Are you sure you want to delete this book?',
            warning: 'Warning',
            deletedSuccessfully: 'Deleted successfully',
            failedToDelete: 'Failed to delete',
            addedSuccessfully: 'Added successfully',
            updatedSuccessfully: 'Updated successfully',
            confirmApproveRequest: 'Are you sure you want to approve this request?',
            confirmApproval: 'Confirm Approval',
            purchaseRequestApproved: 'Purchase request approved',
            failedToApproveRequest: 'Failed to approve request',
            confirmRejectRequest: 'Are you sure you want to reject this request?',
            confirmRejection: 'Confirm Rejection',
            purchaseRequestRejected: 'Purchase request rejected',
            failedToRejectRequest: 'Failed to reject request',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected'
        },
        adminUserManagement: {
            userManagement: "User Management",
            searchUsers: "Search Users...",
            userStatus: "User Status",
            all: "All",
            active: "Active",
            disabled: "Disabled",
            id: "ID",
            username: "Username",
            name: "Name",
            role: "Role",
            administrator: "Administrator",
            superAdmin: "Super Administrator",
            user: "User",
            status: "Status",
            currentBorrows: "Current Borrows",
            totalBorrows: "Total Borrows",
            overdueTimes: "Overdue Times",
            actions: "Actions",
            disable: "Disable",
            enable: "Enable",
            resetPassword: "Reset Password",
            demote: "Demote",
            promote: "Promote",
            userDetails: "User Details",
            basicInformation: "Basic Information",
            borrowingStatistics: "Borrowing Statistics",
            confirmAction: "Are you sure you want to {action} this user?",
            warning: "Warning",
            actionSuccess: "{action} successful",
            actionFailed: "Failed to {action}",
            confirmResetPassword: "Are you sure you want to reset this user's password?",
            resetPasswordSuccess: "Password reset successful, new password has been sent to user's email",
            resetPasswordFailed: "Failed to reset password",
            roleUpdated: "User role updated to {role}"
        },
        adminBorrowManagement: {
            borrowManagement: "Borrow Management",
            searchBooksOrUsers: "Search Books",
            borrowStatus: "Borrow Status",
            all: "All",
            borrowing: "Borrowing",
            returned: "Returned",
            overdue: "Overdue",
            startDate: "Start Date",
            endDate: "End Date",
            borrowId: "Borrow ID",
            book: "Book",
            borrower: "Borrower",
            borrowDate: "Borrow Date",
            dueDate: "Due Date",
            actualReturnDate: "Actual Return Date",
            status: "Status",
            actions: "Actions",
            confirmReturn: "Confirm Return",
            handleOverdue: "Handle Overdue",
            borrowInformation: "Borrow Information",
            handleMethod: "Handle Method",
            fine: "Fine",
            warning: "Warning",
            confirm: "Confirm",
            addToBlacklist: "Add to Blacklist",
            fineAmount: "Fine Amount",
            remarks: "Remarks",
            confirmReturnMessage: "Are you sure this book has been returned?",
            returnConfirmedSuccessfully: "Return confirmed successfully",
            failedToConfirmReturn: "Failed to confirm return",
            handledSuccessfully: "Handled successfully",
            failedToHandle: "Failed to handle",
            overdueDays: "Overdue Days"
        },
        footer: {
            libraryTitle: 'Library',
            libraryAddress: 'Somewhere, Singapore',
            copyright: '© {year} Library System. All rights reserved.',
            quickLinksTitle: 'Quick Links',
            contactUsTitle: 'Contact Us',
            contactPhone: '+65 1234 5678',
            contactEmail: 'library@library.com'
        }
    }
}

export const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('locale') || 'en',
    fallbackLocale: 'en',
    messages
}) 