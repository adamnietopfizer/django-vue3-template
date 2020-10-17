import { shallowMount } from "@vue/test-utils";
import Quote from "@/components/Quote.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(Quote, {
      props: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
