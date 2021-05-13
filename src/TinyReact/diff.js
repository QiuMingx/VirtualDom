import mountElement from './mountElement'
import updateNodeElement from './updateNodeElement';
import updateTextNode from './updateTextNode';
import createDOMElement from './createDOMElement';
import unmountNode from './unmountNode'
import diffComponent from './diffComponent';

export default function diff(virtualDOM, container, oldDOM) {
    const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
    const oldComponent = oldVirtualDOM && oldVirtualDOM.component
    // 判断 oldDOM是否存在

    if(!oldDOM){
        mountElement(virtualDOM, container)

    } else if (virtualDOM.type !== oldVirtualDOM.type && typeof virtualDOM.type !== 'function'){
        // 不同直接替换
        const newElement =  createDOMElement(virtualDOM)
        oldDOM.parentNode.replaceChild(newElement, oldDOM)

    } else if (typeof virtualDOM.type === 'function') {
        //组件
        diffComponent(virtualDOM, oldComponent, oldDOM, container)

    } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
        if(virtualDOM.type === 'text'){
            //更新内容
            updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
        }else{
            //更新元素属性
            updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)

        }
        virtualDOM.children.forEach((child,i) =>{
            diff(child, oldDOM, oldDOM.childNodes[i])
        })

        //删除节点
        //获取旧节点
        let oldChildNodes = oldDOM.childNodes
        //判断旧节点
        if (oldChildNodes.length > virtualDOM.children.length) {
            for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length - 1; i--) {
                unmountNode(oldChildNodes[i])
            }
        }
    }

    

}