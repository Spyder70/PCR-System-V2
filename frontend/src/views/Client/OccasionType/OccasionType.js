import React, { useState, useEffect, useCallback, useRef } from "react"
import { withRouter, useLocation } from "react-router-dom"
import { Col, message, Row, Steps, Divider, Modal, Button } from "antd"
import styled from "styled-components"
import io from "socket.io-client"
import * as Commons from "common/common"
import '../OccasionType/blink.css'

const { Step } = Steps

const CustomSteps = styled(Steps)`
  .ant-steps-item-wait
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: rgba(0, 0, 0, 0.2);
  }
  .ant-steps-item-wait
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description {
    color: rgba(0, 0, 0, 0.2);
  }
  .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: #21acd7;
    font-weight: bold;
  }
  .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description {
    color: #21acd7;
    font-weight: bold;
  }
  .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
  .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description {
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
`

// Button CSS for Feedback Start
const centerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
  paddingTop: "20px",
};

const initialFeedbackButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#0BA8E6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s",
};





// Button CSS for Feedback Ends

const CustomStep = styled(Step)`
  &::after {
    display: none !important;
  }
  .ant-steps-item-icon {
    display: none !important;
  }
`

const OccasionType = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { history, showLoadingPageSpin, hideLoadingPageSpin, auth } = props
  const location = useLocation()
  const registeredOccasionsRef = useRef()

  const [registeredOccasion, setRegisteredOccasion] = useState([])

  const fetchRegisteredOccasion = useCallback(() => {
    showLoadingPageSpin()

    Commons.axiosInstance
      .get(Commons.apiClientRegistrations)
      .then((response) => {
        setRegisteredOccasion(response?.data || [])

        if (response?.data?.length > 0) {
          history.push(`${Commons.clientRegisteredOccasionsRoute}`)
        } else {
          if (location?.state?.login) {
            Modal.info({
              title: "",
              icon: null,
              className: "whitespace-pre-wrap text-center",
              content: (
                <p>
                  【注意事項】
                  <br />
                  <span className="text-red-600">
                    9月1日以降　愛知県在住の方以外は有料検査となります
                  </span>
                  <br />
                  2回目以降の検査予約をされる愛知県在住の方は、検査目的を「2.感染不安があるため」に変更を
                  <br />
                  お願いします。
                  <br />
                  ※検査目的「
                  1.イベント・飲食・旅行・帰省等の経済社会活動を行うに当たり、必要であるため」を選択された場合は有料検査となります。
                </p>
              ),
              okText: "確認",
              okType: "primary",
              okButtonProps: {
                size: "large",
                shape: "round",
                className: "px-8",
              },
              centered: true,
            })

            history.replace({
              pathname: Commons.clientOccasionsRoute,
              state: {},
            })
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          message.warning(Commons.errorSessionMsg)
          history.push(Commons.GET_REDIRECT_LOGIN_ROUTE(auth))
        } else if (error.response.status === 500) {
          message.error(Commons.errorSystemMsg)
        } else {
          message.error(Commons.errorSystemMsg)
        }
      })
      .finally(() => {
        hideLoadingPageSpin()
      })
  }, [showLoadingPageSpin, hideLoadingPageSpin, history, auth, location])

  const occasionTypeSelectHandler = (type) => {
    history.push(`${Commons.clientOccasionsRoute}/${type}`)
  }

  useEffect(() => {
    fetchRegisteredOccasion()

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    registeredOccasionsRef.current = registeredOccasion

    // eslint-disable-next-line
  }, [registeredOccasion])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const socket = io(Commons.siteURL, { path: "/socket.io" })

    socket.on("newEvent", (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        fetchRegisteredOccasion()
      }
    })

    socket.on("updateEvent", (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        fetchRegisteredOccasion()
      }
    })

    socket.on("deleteEvent", (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        fetchRegisteredOccasion()
      }
    })

    socket.on("cancelRegistration", (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        if (response.occasionId && registeredOccasionsRef.current) {
          registeredOccasionsRef.current.forEach((registeredOccasion) => {
            if (
              response.occasionId + "" ===
              registeredOccasion.occasionId + ""
            ) {
              fetchRegisteredOccasion()
            }
          })
        }
      }
    })

    socket.on("confirmRegistration", (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        if (response.occasionId && registeredOccasionsRef.current) {
          registeredOccasionsRef.current.forEach((registeredOccasion) => {
            if (
              response.occasionId + "" ===
              registeredOccasion.occasionId + ""
            ) {
              fetchRegisteredOccasion()
            }
          })
        }
      }
    })

    return () => {
      socket.off("newEvent")
      socket.off("updateEvent")
      socket.off("deleteEvent")
      socket.off("cancelRegistration")
      socket.off("confirmRegistration")

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className="mb-8 animate__animated animate__fadeIn">
        <Row gutter={[0, 0]} justify="center">
          <Col xs={24} lg={12} xl={8}>
            <CustomSteps
              type="navigation"
              size="small"
              direction="horizontal"
              responsive={false}
              style={{
                boxShadow: "0px -1px 0 0 #e8e8e8 inset",
              }}
              current={0}
            >
              <CustomStep
                title={<span className="text-xs">Step 1</span>}
                description={
                  <span className="text-sm whitespace-pre-wrap">{`検査方法\n選択`}</span>
                }
              />
              <CustomStep
                title={<span className="text-xs">Step 2</span>}
                description={
                  <span className="text-sm  whitespace-pre-wrap">{`会場\n選択`}</span>
                }
              />
              <CustomStep
                title={<span className="text-xs">Step 3</span>}
                description={
                  <span className="text-sm whitespace-pre-wrap">{`受診日\n選択`}</span>
                }
              />
              <CustomStep
                title={<span className="text-xs">Step 4</span>}
                description={
                  <span className="text-sm whitespace-pre-wrap">{`受診時間\n選択`}</span>
                }
              />
              <CustomStep
                title={<span className="text-xs">Step 5</span>}
                description={
                  <span className="text-sm whitespace-pre-wrap">{`内容\n確認`}</span>
                }
              />
            </CustomSteps>
          </Col>
        </Row>
        <Row gutter={[0, 0]} justify="center">
          <Col xs={24} lg={12} xl={8} className="mt-8">
            <p className="text-lg font-bold text-gray-500">検査方法選択</p>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="cursor-pointer flex justify-center items-center">
                  <Button
                    type="primary"
                    className="w-full text-xl"
                    style={{ minHeight: "150px" }}
                    onClick={() =>
                      occasionTypeSelectHandler(Commons.OCCASION_TYPE_PCR)
                    }
                  >
                    {Commons.OCCASION_TYPE_PCR_TEXT}
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <div className="cursor-pointer flex justify-center items-center">
                  <Button
                    type="primary"
                    className="w-full text-xl"
                    style={{ minHeight: "150px" }}
                    onClick={() =>
                      occasionTypeSelectHandler(Commons.OCCASION_TYPE_ANTIGEN)
                    }
                  >
                    {Commons.OCCASION_TYPE_ANTIGEN_TEXT}
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div style={centerStyle}>
      <div onClick={()=>history.replace('/eventsurvey')}>
        <button
          className={isHovered ? "" : "blinking-text"}
          style={{
            ...initialFeedbackButtonStyle,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Your Feedback 📝
        </button>
      </div>
    </div>
    </>
  )
}

export default withRouter(OccasionType)
