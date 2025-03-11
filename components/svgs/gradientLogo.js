import * as React from "react"
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg"

const GradientLogo = (props) => (
  <Svg
  xmlns="http://www.w3.org/2000/svg"
  width={252}
  height={166}
  fill="none"
  {...props}
>
  <Path
    fill="url(#a)"
    fillRule="evenodd"
    d="M165.878 4.835c5.323 8.46 83.148 135.45 85.412 141.814 2.58 7.251-2.194 13.042-9.133 16.514-4.823 2.416-10.477 2.819-39.534 2.819-29.139 0-34.665-.396-39.318-2.819-4.284-2.228-9.025-8.869-22.726-31.824-14.428-24.174-18.28-29.489-23.12-31.902-4.053-1.94-7.282-2.277-11.388-.565-4.693 1.956-8.024 6.383-20.968 27.874-24.77 41.12-21.933 39.241-59.219 39.241-14.237 0-25.884-.43-25.884-.957 0-.526 11.252-19.661 25.006-42.52C40.594 96.598 52.27 78.965 56.01 75.687c16.12-14.127 39.52-17.862 57.3-9.147 5.044 2.473 9.993 5.427 13.938 9.914 2.621 2.98 13.922 20.63 25.113 39.223 11.865 19.713 19.021 33.459 23.255 34.565 4.705 1.23 9.881-1.537 10.968-5.862 1.089-4.983-6.573-16.607-40.544-72.991C123.185 33.455 103.281.664 102.911 0H163.016l2.862 4.835Z"
    clipRule="evenodd"
  />
  <Defs>
    <RadialGradient
      id="a"
      cx={0}
      cy={0}
      r={1}
      gradientTransform="rotate(108.137 8.3 121.247) scale(467.826 1578.16)"
      gradientUnits="userSpaceOnUse"
    >
      <Stop stopColor="#fff" />
      <Stop offset={1} stopColor="#fff" stopOpacity={0.5} />
    </RadialGradient>
  </Defs>
</Svg>
)
export default GradientLogo
