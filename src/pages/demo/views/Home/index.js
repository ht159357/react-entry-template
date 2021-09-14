import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Toast } from 'zarm'
import { plus, reduce } from '@/store/modules/counter'
import { useToggle, useUpdate, useMount, useUnmount, useUpdateEffect } from 'ahooks'
import { AppInvoke, AppRegister } from '@/utils/jsBridge'
import { PROTOCOL_CONFIG, HANDLER_CONFIG } from '@/constants/protocol'
import './index.scss'

const Home = props => {
  const [toggleState, { toggle }] = useToggle(false)

  // 调用原生
  AppInvoke(PROTOCOL_CONFIG.OPEN_TEL, { a: 1, c: 2 }, '18119921782')
  // 注册原生回调
  AppRegister(HANDLER_CONFIG.OPEN_TEL_HANDLER, data => {
    console.log(data)
  })
  // 模拟原生调用
  setTimeout(() => {
    window.OPEN_TEL_HANDLER({ someData: '10086' })
  }, 5000)

  return (
    <div>
      {/* ROUTER DEMO */}
      <Link to="/my">
        <button className="btn">turn to My page</button>
      </Link>
      {/* CSS PX2REM DEMO */}
      <div className="bg-red w-375">375px</div>
      <div className="bg-red w-750">750px</div>
      <div className="bg-red w-100 h-100">100*100</div>
      {/* REDUX DEMO */}
      <p>count is: {props.count}</p>
      <button className="btn m-r-10" onClick={props.plus}>plus</button>
      <button className="btn m-r-10" onClick={props.reduce}>reduce</button>
      {/* ali hooks DEMO */}
      <button className="btn m-r-10" onClick={() => {
        toggle()
      }}>
        toggle components
      </button>
      {toggleState && <DemoComponent />}
    </div>
  )
}

const DemoComponent = () => {
  const update = useUpdate()

  // 组件首次渲染时
  useMount(() => {
    Toast.show('组件挂载')
  })

  // 组件被卸载时
  useUnmount(() => {
    Toast.show('组件卸载')
  })

  // 依赖更新时（组件首次渲染时，不触发）
  useUpdateEffect(() => {
    Toast.show('组件依赖更新')
  })


  return (
    <div style={{ background: 'red' }}>
      <div>component, now date: {Date.now()}</div>
      <button className="btn" onClick={update}>force update date</button>
    </div>
  )
}

Home.propTypes = {
  count: PropTypes.number,
  plus: PropTypes.func,
  reduce: PropTypes.func,
}

const mapStateToProps = state => ({
  'count': state.counter.count,
})

const mapDispatchToProps = dispatch => ({
  plus: () => dispatch(plus()),
  reduce: () => dispatch(reduce()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
