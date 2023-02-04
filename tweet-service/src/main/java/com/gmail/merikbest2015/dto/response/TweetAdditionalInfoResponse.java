package com.gmail.merikbest2015.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gmail.merikbest2015.dto.TweetAdditionalInfoUserResponse;
import com.gmail.merikbest2015.enums.ReplyType;
import lombok.Data;

@Data
public class TweetAdditionalInfoResponse {
    private String text;
    private ReplyType replyType;
    private Long addressedTweetId;
    private TweetAdditionalInfoUserResponse user;
    @JsonProperty("isDeleted")
    private boolean isDeleted;
}
