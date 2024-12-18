let PREV_TYPE = "PREV";
let CURRENT_TYPE = "CURRENT";
let NEXT_TYPE = "NEXT";

let curYear = "2024";
let curMonth = 12;
let mainBody = document.querySelector(".calendar-main-body");
// 在JavaScript中，如果日期设置为0，Date对象会自动回退到上个月的最后一天，
// 这样就可以通过getDate()方法获取到上个月的天数，也就是当前月的天数。
/**
 * tag 计算当月的总天数
 * @param {*} year
 * @param {*} month 现实生活中的月份
 * @returns
 */
function getDaysInCurrentMonth(year, month) {
  // JavaScript中的月份是从0开始的，因为我们要获取当月的总天数，
  // 就是下一个月的第0天。比如说我传入的现实生活中的2024年12月份，
  // 而js的月份是[0-11],传入12，表示2025年的一月份。2025年一月份的第0
  // 天就是当前月份的天数，刚好不加不减
  return new Date(year, month, 0).getDate();
}

/**
 * todo 获取当前月的第一天是周几
 * @param {*} year
 * @param {*} month
 * @returns
 */
function getDayOfMonthFirstDate(year, month) {
  // 因为月份是现实生活中的月份，所以需要减一
  let dateInstance = new Date(year, month - 1, 1);
  let day = dateInstance.getDay();
  return day;
}

console.log(getDayOfMonthFirstDate(2024, 5));

// 创建日期单元格片段的函数 (上个月的补丁+当前月的天数+下一个月的补丁)
function createDateCellFragment(start, end, type) {
  // fragment的作用就是去承载很多个标签，它本身是没有标签的，类似于透明的袋子
  // desc 文档碎片
  let fragment = document.createDocumentFragment();
  for (let i = start; i <= end; i++) {
    let calendarDateElement = document.createElement("div");
    calendarDateElement.innerText = i;

    switch (type) {
      case PREV_TYPE:
        calendarDateElement.classList.add("calendar-date__disable");
        break;
      case CURRENT_TYPE:
        calendarDateElement.classList.add("calendar-date__current");
        calendarDateElement.customCalendarInfo = {
          year: curYear,
          month: curMonth,
          day: i,
        };
        break;
      case NEXT_TYPE:
        calendarDateElement.classList.add("calendar-date__disable");
        break;
      default:
        break;
    }
    // 零散的东西变成了整体
    fragment.appendChild(calendarDateElement);
  }
  return fragment;
}

// todo 更新日历 年和月的函数

function updateYearAndMonth(newYear, newMonth) {
  document
    .querySelector(".calendar")
    .style.setProperty("--month", `'${newMonth}'`);

  let dateTitle = document.querySelector(".date-title");
  dateTitle.innerHTML = `${newYear} 年 ${newMonth} 月`;
  curYear = newYear;
  curMonth = newMonth;
}

// todo 绑定事件后的处理函数
function bindEvent() {
  let topRoot = document.querySelector(".top");
  let dateInstance = new Date(curYear, curMonth - 1);
  //现实生活中 2024 年 12月的日期对象(在JS中月份需要减一)
  topRoot.addEventListener("click", function (e) {
    if (e.target.className === "prev") {
      dateInstance.setMonth(dateInstance.getMonth() - 1);

      let newYear = dateInstance.getFullYear();
      let newMonth = dateInstance.getMonth() + 1;
      // 让月份减一 关于年份的话JS中Date对象会自动处理好的
      updateYearAndMonth(newYear, newMonth);
      console.log(newYear, newMonth);
      createCalendar(newYear, newMonth);
    } else if (e.target.className === "next") {
      dateInstance.setMonth(dateInstance.getMonth() + 1);

      let newYear = dateInstance.getFullYear();
      let newMonth = dateInstance.getMonth() + 1;
      updateYearAndMonth(newYear, newMonth);
      console.log(newYear, newMonth);
      createCalendar(newYear, newMonth);
    }
  });
  mainBody.addEventListener("click", function (e) {
    if (e.target.className === "calendar-date__current") {
      console.log(e.target.customCalendarInfo);
    }
  });
}
bindEvent();
/**
 * todo 创建日历的函数
 * @param {*} year
 * @param {*} month
 */
function createCalendar(year, month) {
  document
    .querySelector(".calendar")
    .style.setProperty("--month", `'${month}'`);
  const WEEK_DATE_COUNT = 7;
  // 获取当前月份的的总天数
  let currentMonthDateCount = getDaysInCurrentMonth(year, month);
  //获取上一个月的总天数
  let pervMonthDateCount = getDaysInCurrentMonth(year, month - 1);
  //获取卡片中第一行需要补的日期个数（当前月份的第一天是周几就补几个）

  //例如当前月份的第一天是周日就补0个，周一补一个
  let dayOfCurrentMonthFirstDay = getDayOfMonthFirstDate(year, month);
  // 上一个月的补丁
  let pervMonthDatePadding = dayOfCurrentMonthFirstDay;
  // 下一个月的补丁
  let nextMonthDatePadding =
    WEEK_DATE_COUNT -
    ((pervMonthDatePadding + currentMonthDateCount) % WEEK_DATE_COUNT);
  if (nextMonthDatePadding === 7) nextMonthDatePadding = 0;

  let mainFragment = document.createDocumentFragment();
  // let mainBody = document.querySelector(".calendar-main-body");
  // 创建一号前需要补的日期单元格
  let pervMonthDatePaddingFragment = createDateCellFragment(
    pervMonthDateCount - pervMonthDatePadding + 1,
    pervMonthDateCount,
    PREV_TYPE
  );
  // 创建当前月需要补的日期单元格
  let currMonthDatePaddingFragment = createDateCellFragment(
    1,
    currentMonthDateCount,
    CURRENT_TYPE
  );
  // 创建下月需要补的日期单元格
  let nextMonthDatePaddingFragment = createDateCellFragment(
    1,
    nextMonthDatePadding,
    NEXT_TYPE
  );

  mainFragment.appendChild(pervMonthDatePaddingFragment);
  mainFragment.appendChild(currMonthDatePaddingFragment);
  mainFragment.appendChild(nextMonthDatePaddingFragment);
  mainBody.innerHTML = "";
  mainBody.appendChild(mainFragment);
}

createCalendar(2024, 12);
