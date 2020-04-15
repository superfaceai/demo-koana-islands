import React from "react";
import { Box, Flex, Text, Heading, Image, Button } from "rebass";

import { Label, Select, Radio } from "@rebass/forms";

import Layout from "../containers/layout";
import Container from "../containers/container";

import { Register } from "superdriver";

import hardcodeFetchAlertsForAddressLocality from "../consumer/hardcodeFetch";
import fetchAlertsForAddressLocality from "../consumer/superfaceFetch";

import {
  AlertTitleKey,
  AlertDescriptionKey,
  AlertSeverityKey
} from "../consumer/representor";

/**
 * Home page
 */
class Home extends React.Component {
  /**
   * Constructor
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      submitted: false,
      services: props.services,
      addressLocality: props.addressLocality,
      hardcode: props.hardcode,
      strategy: props.strategy,
      report: props.report
    };
  }

  /**
   * Client-side form submition handler (unused for demo)
   *
   * @param {string} addressLocality address locality to query
   */
  async submitForm(addressLocality) {
    console.log("submitting form", addressLocality);

    let report = {};
    for (let i = 0; i < this.state.services.length; i++) {
      const service = this.state.services[i];
      const response = await handle(
        fetchAlertsForAddressLocality(service, addressLocality, PROFILE_ID)
      );
      if (response.ok) {
        report[service.serviceUrl] = response.data;
        console.log("service responded ", service.serviceUrl, response.data);
      } else {
        console.error(
          "problem fetching alerts for a service",
          service.serviceUrl,
          response.error
        ); // TODO: fetch new list of services from registry
      }
    }

    this.setState({
      addressLocality,
      report
    });
  }

  /**
   * Helper function to generate components for reported results
   */
  populateReportComponents() {
    let reportComponents = [];
    let successReportCount = 0;
    for (let serviceUrl in this.state.report) {
      let situationComponents = [];
      const data = this.state.report[serviceUrl];

      if (data.problem) {
        // Report error
        situationComponents.push(
          <Text fontFamily="monospace" bg="coral" p={1}>
            {data.problem}: {data.detail.status}{" "}
            {data.detail.detail ? ` - ` + data.detail.detail.title : ""}
          </Text>
        );
      } else {
        // Process ok data
        if (AlertSeverityKey in data) {
          let color = "white";
          switch (data[AlertSeverityKey]) {
            case "advisory":
              color = "yellow";
              break;
            case "watch":
              color = "orange";
              break;
            case "warning":
              color = "red";
              break;
          }
          situationComponents.push(
            <Text bg={color}>{data[AlertSeverityKey]}</Text>
          );
        }
        if (AlertTitleKey in data) {
          situationComponents.push(
            <Text fontWeight="heading">{data[AlertTitleKey]}</Text>
          );
        }
        if (AlertDescriptionKey in data) {
          situationComponents.push(<Text>{data[AlertDescriptionKey]}</Text>);
        }
        successReportCount++;
      }

      let url = "";
      try {
        url = new URL(serviceUrl);
      } catch (err) {
        console.err("problem parsing URL", err);
      }

      const glitchIndex = url.hostname.indexOf(".glitch.me");
      let glitchDomain = undefined;
      if (glitchIndex > 0) {
        glitchDomain = url.hostname.substr(0, glitchIndex);
        console.log("Glitch domain detected:", glitchDomain);
      }

      const oneReportComponent = (
        <Box
          p={2}
          mt={2}
          sx={{
            backgroundColor: "#f7f7f7",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23989898' fill-opacity='0.19' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          <Box py={2}>
            <Heading fontSize={3}>Alerts Provider</Heading>
            <Text fontFamily="monospace">
              <a href={serviceUrl} target="_blank" rel="noopener">
                {serviceUrl}
              </a>{" "}
              {this.state.hardcode ? "(hardcoded)" : ""}(
              {glitchDomain ? (
                <a
                  href={"https://glitch.com/edit/#!/" + glitchDomain}
                  target="_blank"
                  rel="noopener"
                >
                  source
                </a>
              ) : (
                ""
              )}
              )
            </Text>
          </Box>

          <Box py={2}>
            <Heading fontSize={3}>Situtation</Heading>
            <Box fontFamily="monospace">
              {situationComponents.map((entry, index) => (
                <React.Fragment key={index}>{entry}</React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
      );
      reportComponents.push(oneReportComponent);
      // If strategy is to show only one success then skip the rest
      if (this.state.strategy === "one" && successReportCount) break;
    }

    if (reportComponents.length === 0) {
      reportComponents.push(
        <Box my={4} bg={"coral"}>
          <Text fontFamily="monospace">No available services reports</Text>
        </Box>
      );
    }

    return reportComponents;
  }

  /**
   * Render the page
   */
  render() {
    console.log("rendering state: ", this.state);
    const reportComponents = this.populateReportComponents();

    return (
      <Layout title="superface demo">
        {/* Map */}
        <Flex
          minHeight={"50vh"}
          justifyContent="center"
          alignItems="flex-end"
          sx={{
            backgroundImage: "url(map.jpg)",
            backgroundSize: "cover",
            backgroundAttachment: "scroll",
            backgroundPosition: "50% 100%",
            backgroundRepeat: "no-repeat",

            borderTop: "0px solid #000",
            borderRight: "0px solid #000",
            borderBottom: "1px solid #c8c8c8",
            borderLeft: "0px solid #000"
          }}
        >
          <Box
            width={1 / 2}
            px={2}
            textAlign="center"
            pb={3}
            sx={{
              visibility:
                this.state.addressLocality == "Arbordale" ? "visible" : "hidden"
            }}
          >
            <Image src="red-pin.png" width="75px" />
            <Text p={1} fontWeight="heading">
              Arbordale
            </Text>
          </Box>
          <Box
            width={1 / 2}
            px={2}
            textAlign="center"
            pb={6}
            sx={{
              visibility:
                this.state.addressLocality == "Lexington" ? "visible" : "hidden"
            }}
          >
            <Image src="red-pin.png" width="75px" />
            <Text p={1} fontWeight="heading">
              Lexington
            </Text>
          </Box>
        </Flex>

        {/* Form */}
        <Container>
          <Flex
            flexWrap="wrap"
            as="form"
            py={3}
            //
            // Handle on server-side
            //
            action="/"
            method="get"

            //
            // Handle on client-side
            //
            // onSubmit={event => {
            //   event.preventDefault()
            //   this.submitForm(event.target.addressLocality.value);
            // }}
          >
            {/* Dropdown */}
            <Box width={[1, 3 / 5]} m={2}>
              <Label
                htmlFor="addressLocality"
                fontSize={3}
                fontWeight="heading"
                mb={1}
              >
                Location
              </Label>
              <Select
                id="addressLocality"
                name="addressLocality"
                defaultValue={this.state.addressLocality}
                bg="white"
              >
                <option>Arbordale</option>
                <option>Lexington</option>
              </Select>

              <Button mt={1} width="100%">
                Check Weather Alerts
              </Button>
            </Box>

            {/* Implementation */}
            <Box py={1} m={2} fontSize={1}>
              <Label fontWeight="heading" mb={1} pt={2}>
                Consumer Implementation
              </Label>
              <Label>
                <Radio
                  id="superface"
                  name="hardcode"
                  value="false"
                  defaultChecked={!this.state.hardcode}
                  bg="white"
                />
                superface
              </Label>
              <Label>
                <Radio
                  id="hardcoded-fetch"
                  name="hardcode"
                  value="true"
                  defaultChecked={this.state.hardcode}
                  bg="white"
                />
                hard-coded fetch
              </Label>
            </Box>

            {/* Strategy */}
            <Box py={1} m={2} fontSize={1}>
              <Label fontWeight="heading" mb={1} pt={2}>
                Provider Strategy
              </Label>
              <Label>
                <Radio
                  id="one"
                  name="strategy"
                  value="one"
                  defaultChecked={this.state.strategy === "one"}
                  bg="white"
                />
                one
              </Label>
              <Label>
                <Radio
                  id="all"
                  name="strategy"
                  value="all"
                  defaultChecked={this.state.strategy !== "one"}
                  bg="white"
                />
                all
              </Label>
            </Box>
          </Flex>
        </Container>

        {/* Reports */}
        <Container>
          {reportComponents.map((entry, index) => (
            <React.Fragment key={index}>{entry}</React.Fragment>
          ))}
        </Container>

        {/* Registry */}
        <Container>
          <Box px={2} py={3}>
            <Heading fontSize={3}>Registry</Heading>
            <Text fontFamily="monospace">{this.props.registryUrl}</Text>
          </Box>
        </Container>

        {/* <Container mt='4em'>
        <div className="glitch-embed-wrap" style={{ height: '420px', width: '100%'}}>
          <iframe
            src="https://glitch.com/embed/#!/embed/ballistic-sombrero?path=routes/alerts.js&previewSize=0"
            title="ballistic-sombrero on Glitch"
            allow="geolocation; microphone; camera; midi; vr; encrypted-media"
            style={{height: '100%', width: '100%', border: '0'}}>
          </iframe>
        </div>
        </Container>    */}
      </Layout>
    );
  }
}

const REGISTRY_URL = process.env.REGISTRY_URL;
const PROFILE_ID = "http://supermodel.io/superface/weather/profile/WeatherAlerts";
const DefaultAddressLocality = "Arbordale";
const DefaultHardcode = false;
const DefaultStrategy = "one";

/**
 * Initial data for the page
 */
Home.getInitialProps = async function({ query }) {
  let addressLocality = DefaultAddressLocality;
  if (query && query.addressLocality) {
    addressLocality = query.addressLocality;
    console.log(
      "using address locality from query parmeter: ",
      addressLocality
    ); // TODO: Make sure it is allowed value
  }

  let hardcode = DefaultHardcode;
  if (query && query.hardcode) {
    hardcode = query.hardcode === "true";
    console.log("using hardcode from query parmeter: ", hardcode);
  }

  let strategy = DefaultStrategy;
  if (query && query.strategy) {
    strategy = query.strategy === "one" ? "one" : "all";
    console.log("using strategy from query parmeter: ", strategy);
  }

  let initialProps = {
    registryUrl: REGISTRY_URL,
    services: [],
    addressLocality,
    hardcode,
    strategy,
    report: {},
    problem: undefined,
    detail: undefined
  };

  if (hardcode) {
    const response = await handle(
      hardcodeFetchAlertsForAddressLocality(addressLocality)
    );
    const hardcodedServiceUrl = "https://ballistic-sombrero.glitch.me";
    if (response.ok) {
      initialProps.report[hardcodedServiceUrl] = response.data;
    } else {
      initialProps.report[hardcodedServiceUrl] = {
        problem: `fetching data from ${hardcodedServiceUrl} API failed`,
        detail: response.error
      };
      console.error(
        "problem fetching alerts for the hard-coded service",
        response.error
      );
    }
  } else {
    // Use superface to fetch services and data
    console.log("using registry", REGISTRY_URL);

    // Find the available services
    const response = await handle(fetchAlertServices(REGISTRY_URL));
    if (!response.ok) {
      console.error("unable to fetch services: ", response.error);
      return initialProps;
    }

    initialProps.services = response.data;
    // console.log('services found: ', initialProps.services)

    // Fetch initial data from all available services
    for (let i = 0; i < initialProps.services.length; i++) {
      const service = initialProps.services[i];
      let detail = {}
      const response = await handle(
        fetchAlertsForAddressLocality(service, addressLocality, PROFILE_ID, detail)
      )
      
      console.log(response);
      console.log('>> call detail', detail);
      
      if (response.ok) {
        initialProps.report[service.serviceUrl] = response.data;
      } else {
        initialProps.report[service.serviceUrl] = {
          problem: `fetching data from ${service.serviceUrl} API failed`,
          detail: response.error
        };
        console.error(
          "problem fetching alerts for a service",
          service.serviceUrl,
          response.error
        );
      }
    }
  }

  return initialProps;
};

/**
 * Async/Await handler
 *
 * @param {Promise} promise
 */
const handle = promise =>
  promise
    .then(data => ({ ok: true, data }))
    .catch(error => Promise.resolve({ ok: false, error }));

/**
 * Fetch services matching the weather profile
 *
 * @param {string} registryUrl URL of the DISCO registry
 */
async function fetchAlertServices(registryUrl) {
  const registry = new Register(registryUrl);
  return registry.findServices(PROFILE_ID);
}

export default Home;
