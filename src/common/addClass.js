export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')    //判断className 的开头或结尾无字符或者是空格
    return reg.test(el.className)
}


export function addClass(el, className) {
    if (hasClass(el, className)) {    //有这个类名就返回
        return
    }

    let newClass = el.className.split(' ')  //split() 将原本的className字符串按空格分割成数组
    newClass.push(className)        //将新的className 添加到上面的数组中
    el.className = newClass.join(' ')        //join() 以空格为连接符链接成class字符串
}

export function removeClass(el, className) {
    //先判断是否含有这个class，含有时，才继续
    if (!hasClass(el, className)) {
        return
    }

    let newClass = el.className.split(' ')     //分割class字符串为class数组
    let index = newClass.findIndex((item) => {   //找到指定的class在class数组中的索引
        return item === className
    })
    newClass.splice(index, 1)   // 删除索引中的这项
    el.className = newClass.join(' ')  //将class数组以空格为连接符连接成class字符串
}

