import { TryCatch } from "../middlewares/error.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { calculatePercentage, getChartData, getInventories, } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats;
    const key = "admin-stats";
    if (myCache.has(key))
        stats = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0), // last date of prev month
        };
        const sixMonthAgo = {
            start: new Date(today.getMonth() - 6),
            end: today,
        };
        const thisMonthProdsPromise = Product.find({
            createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
        });
        const lastMonthProdsPromise = Product.find({
            createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
        });
        const thisMonthUsersPromise = User.find({
            createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
        });
        const lastMonthUsersPromise = User.find({
            createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
        });
        const thisMonthOrdersPromise = Order.find({
            createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
        });
        const lastMonthOrdersPromise = Order.find({
            createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
        });
        const sixMonthAgoOrdersPromise = Order.find({
            createdAt: { $gte: sixMonthAgo.start, $lte: sixMonthAgo.end },
        });
        const latestTransactionsPromise = Order.find({})
            .limit(4)
            .select(["orderItems", "discount", "total", "status"]);
        const [thisMonthUsers, lastMonthUsers, thisMonthProds, lastMonthProds, thisMonthOrders, lastMonthOrders, userCount, productCount, allOrders, sixMonthAgoOrders, distinctCategories, femaleUsers, latestTransactions,] = await Promise.all([
            thisMonthUsersPromise,
            lastMonthUsersPromise,
            thisMonthProdsPromise,
            lastMonthProdsPromise,
            thisMonthOrdersPromise,
            lastMonthOrdersPromise,
            User.countDocuments(),
            Product.countDocuments(),
            Order.find({}).select("total"),
            sixMonthAgoOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionsPromise,
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((acc, order) => acc + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((acc, order) => acc + (order.total || 0), 0);
        const totalRevenue = allOrders.reduce((acc, order) => acc + (order.total || 0), 0);
        const changePercentage = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            product: calculatePercentage(thisMonthProds.length, lastMonthProds.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const countAndRevenue = {
            totalRevenue,
            userCount,
            productCount,
            orderCount: allOrders.length,
        };
        let orderMonthTransactions = getChartData({
            length: 6,
            today,
            docArr: sixMonthAgoOrders,
        });
        let orderMonthRevenue = getChartData({
            length: 6,
            today,
            docArr: sixMonthAgoOrders,
            property: "total",
        });
        // sixMonthAgoOrders.forEach((order) => {
        //   const creationDate = order.createdAt;
        //   const monthDiff =
        //     (today.getMonth() - creationDate.getMonth() + 12) % 12;
        //   if (monthDiff < 6) {
        //     orderMonthTransactions[6 - monthDiff - 1] += 1;
        //     orderMonthRevenue[6 - monthDiff - 1] += order.total;
        //   }
        // });
        const inventory = await getInventories({
            categories: distinctCategories,
            productCount,
        });
        // // explicitly annotate type to acc
        // const inventory = distinctCategories.reduce((acc:{name:string,count:number}[],curr,pos)=>{  // <> defines the accumulator type of
        //   return [...acc,{name:curr,count:inventoryCount[pos]}]
        // },[])
        const userRatio = {
            femaleUsers,
            maleUsers: userCount - femaleUsers,
        };
        const modifiedTransactions = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));
        stats = {
            inventory,
            changePercentage,
            countAndRevenue,
            chart: {
                order: orderMonthTransactions,
                revenue: orderMonthRevenue,
            },
            userRatio,
            latestTransactions: modifiedTransactions,
        };
        myCache.set(key, JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => {
    const key = "admin-pie-charts";
    let charts;
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const allOrderPromise = Order.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shippingCharges",
        ]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, productsCount, productsOutOfStock, allOrders, allUsersDOB, adminUsers, customerUsers,] = await Promise.all([
            Order.countDocuments({ status: "processing" }),
            Order.countDocuments({ status: "shipped" }),
            Order.countDocuments({ status: "delivered" }),
            Product.distinct("category"),
            Product.countDocuments({}),
            Product.countDocuments({ stock: 0 }),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCategories = await getInventories({
            categories,
            productCount: productsCount,
        });
        const stockAvailablity = {
            inStock: productsCount - productsOutOfStock,
            outOfStock: productsOutOfStock,
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
        const usersAgeGroup = {
            teen: allUsersDOB.filter((i) => i.age < 20).length,
            adult: allUsersDOB.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsersDOB.filter((i) => i.age > 40).length,
        };
        const adminCustomers = {
            admin: adminUsers,
            customer: customerUsers,
        };
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            adminCustomers,
            usersAgeGroup,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    res.status(200).json({
        success: true,
        charts,
    });
});
export const getBarCharts = TryCatch(async (req, res, next) => {
    const key = "admin-bar-charts";
    let charts;
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const sixMonthProductPromise = Product.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const sixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const twelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const [products, users, orders] = await Promise.all([
            sixMonthProductPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise,
        ]);
        const productCounts = getChartData({
            length: 6,
            today,
            docArr: products,
        });
        const usersCounts = getChartData({ length: 6, today, docArr: users });
        const ordersCounts = getChartData({ length: 12, today, docArr: orders });
        charts = {
            users: usersCounts,
            products: productCounts,
            orders: ordersCounts,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = TryCatch(async (req, res, next) => {
    const key = "admin-line-charts";
    let charts;
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        };
        const [products, users, orders] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"]),
        ]);
        const productCounts = getChartData({
            length: 12,
            today,
            docArr: products,
        });
        const usersCounts = getChartData({ length: 12, today, docArr: users });
        const discount = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "discount",
        });
        const revenue = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "total",
        });
        charts = {
            users: usersCounts,
            products: productCounts,
            discount,
            revenue,
        };
        // myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
