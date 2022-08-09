import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import App from "./App";
import React from "react";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/utils";

jest.setTimeout(30000);
describe("App component", () => {
  const { container } = render(<App />);
  it("renders App properly", () => {
    expect(container).toMatchSnapshot();
  });
  it("renders homepage signup properly", () => {
    expect(container.getElementsByClassName("signupform")).not.toBeNull();
  });
});

describe("Home page", () => {
  const { container } = render(<App />);
  localStorage.setItem("userid", "test");

  it("renders HomePagePosts properly", () => {
    expect(container.getElementsByClassName("homepagegrid")).not.toBeNull();
  });
  it("renders HomePage properly", () => {
    expect(container.getElementsByClassName("userinfoholder")).not.toBeNull();
  });
});

describe("Messages", () => {
  localStorage.setItem("userid", "test");

  it("Messages icon exists", async () => {
    const { container } = render(<App />);
    const button = await screen.findByTestId("FavoriteRoundedIcon");
    expect(button).not.toBeNull();
  });
  it("Message loads onclick", async () => {
    const { container } = render(<App />);
    localStorage.setItem("userid", "test");

    const button = await screen.findByTestId("ChatBubbleIcon");
    await new Promise((r) => setTimeout(r, 1000));
    userEvent.click(button);
    await new Promise((r) => setTimeout(r, 1000));
    expect(container).toMatchSnapshot();
    expect(container.getElementsByClassName("messageheader").length).toBe(1);
  });
});

describe("Notifications", () => {
//   localStorage.setItem("userid", "test");

  it("Notifications load onclick", async () => {
    const { container } = render(<App />);
    localStorage.setItem("userid", "test");
    await new Promise((r) => setTimeout(r, 3000));
    const button = screen.getByTestId("FavoriteRoundedIcon");
    userEvent.click(button);
    await new Promise((r) => setTimeout(r, 3000));
    // expect(container).toMatchSnapshot();
    expect(container.getElementsByClassName("popup").length).toBe(1);
  });
});
