package com.gmail.merikbest2015.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "bookmarks")
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bookmarks_seq")
    @SequenceGenerator(name = "bookmarks_seq", sequenceName = "bookmarks_seq", initialValue = 100, allocationSize = 1)
    private Long id;

    @Column(name = "bookmark_date")
    private LocalDateTime bookmarkDate = LocalDateTime.now();

    @NonNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NonNull
    @Column(name = "tweet_id", nullable = false)
    private Long tweetId;
}
