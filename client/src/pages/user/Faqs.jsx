import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
} from "@mui/material";

import { IoIosArrowDown } from "react-icons/io";
import { Datas } from "../../FaqsData";

import Qlogo from "../../assets/question.png";
import Navbar from "../../global/nav/Navbar";
import Footer from "../../global/footer/Footer";

const Faqs = () => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-5xl py-20 font-thin items-center mx-auto">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <div className="flex flex-col mx-auto">
            <h1 className="font-bebas font-bold tracking-wider text-4xl text-center mb-10">
              Frequently Asked Questions
            </h1>
            <img
              src={Qlogo}
              alt=""
              className="hidden md:block rounded-md w-[30rem]"
            />
          </div>
        </Grid>
        <Grid item alignItems="center" justifyContent="center">
          <Grid container spacing={1} className="drop-shadow-xl">
            {Datas.map((data, i) => (
              <Grid key={i} item md={6}>
                {/* Start of Accordion */}
                <Accordion
                  expanded={expanded === i}
                  onChange={(e, isExpanded) => handleChange(isExpanded, i)}
                >
                  <AccordionSummary
                    id={`panel${i}-header`}
                    aria-controls={`panel${i}-content`}
                    expandIcon={<IoIosArrowDown />}
                  >
                    <Box className="">
                      <Typography variant="h5"><span className="font-bebas font-semibold">{data.question}</span></Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <span className="font-kanit text-sm text-gray-700">{data.answer}</span>
                  </AccordionDetails>
                </Accordion>
                {/* End of Accordion */}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
    <Footer />
    </>
  );
};

export default Faqs;
