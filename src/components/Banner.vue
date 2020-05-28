<template>
  <div class="ban-wrapper">
    <div class="banner">
      <swiper :options="swiperOption" class="swiper">
        <swiper-slide>
          <div
            class="banner-img"
            :style="{backgroundImage:`url(${require(`@imgs/banner_2.png`)})`}"
          ></div>
        </swiper-slide>
        <swiper-slide>
          <div class="banner-img"></div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
export default {
    name:"banner",
    data() {
        return {
            swiperOption: {
                pagination: {
                    el: ".swiper-pagination"
                },
                loop:true,
                autoplay:true
            },
        };
    },
    components:{
        swiper,
        swiperSlide
    }
};
</script>

<style lang="less">
.ban-wrapper {
  .wh(7.05rem, 2.41rem);
  margin: 0.37rem auto 0;
  @media @wide {
    margin-top: 0.1rem;
  }
  > .banner {
    .wh(100%);
    // .bg-contain("banner_1.png");

    > .swiper {
      .banner-img {
        .wh(7.05rem, 2.41rem);
        .bg-contain("banner_1.png");
      }
      > .swiper-pagination {
        bottom: -3px;
        > .swiper-pagination-bullet {
          .wh(0.14rem);
          background-color: transparent;
          border: solid 1px #ffffff;
          &-active {
            opacity: 1;
            background-color: #ffffff;
          }
        }
      }
    }
  }
}
</style>