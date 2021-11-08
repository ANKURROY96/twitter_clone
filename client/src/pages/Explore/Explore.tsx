import React, {ChangeEvent, FC, FormEvent, ReactElement, useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {InputAdornment, IconButton} from "@material-ui/core";
import {CircularProgress, Paper} from "@material-ui/core";

import {MainSearchTextField} from "../../components/SearchTextField/MainSearchTextField";
import {
    fetchMediaTweets,
    fetchTweets,
    fetchTweetsByTag,
    fetchTweetsByText,
    fetchTweetsWithVideo,
    resetTweets
} from "../../store/ducks/tweets/actionCreators";
import {BackButton} from "../../components/BackButton/BackButton";
import TweetComponent from "../../components/TweetComponent/TweetComponent";
import {selectIsTweetsLoading, selectTweetsItems} from "../../store/ducks/tweets/selectors";
import {User} from "../../store/ducks/user/contracts/state";
import Follower from "../../components/Follower/Follower";
import {followUser, unfollowUser} from "../../store/ducks/user/actionCreators";
import {useExploreStyles} from "./ExploreStyles";
import {EditIcon, SearchIcon} from "../../icons";
import {fetchUsersSearch, fetchUsersSearchByUsername} from "../../store/ducks/usersSearch/actionCreators";
import {selectUsersSearch, selectUsersSearchIsLoading} from "../../store/ducks/usersSearch/selectors";
import {InfiniteScrollProps, withInfiniteScroll} from "../../hoc/withInfiniteScroll";

const Explore: FC<InfiniteScrollProps> = ({page, isScrolled, setPage, setIsScrolled}): ReactElement => {
    const classes = useExploreStyles();
    const dispatch = useDispatch();
    const isTweetsLoading = useSelector(selectIsTweetsLoading);
    const isUsersLoading = useSelector(selectUsersSearchIsLoading);
    const tweets = useSelector(selectTweetsItems);
    const users = useSelector(selectUsersSearch);
    const location = useLocation<{ tag: string | undefined; text: string | undefined; }>();
    const history = useHistory();
    const [text, setText] = useState<string>("");
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (location.state?.tag !== undefined) {
            dispatch(fetchTweetsByTag(location.state?.tag));
            setText(decodeURIComponent(location.state?.tag));
        }

        if (location.state?.text !== undefined) {
            dispatch(fetchTweetsByText(location.state?.text));
            setText(decodeURIComponent(location.state?.text));
        }

        if (location.state?.tag === undefined && location.state?.text === undefined) {
            dispatch(fetchTweets(page));
            setPage(prevState => prevState + 1);
        }

        return () => {
            dispatch(resetTweets());
            setPage(0);
        };
    }, [location.state?.tag, location.state?.text]);

    useEffect(() => {
        if (isScrolled) {
            dispatch(fetchTweets(page));
        }
        if (isTweetsLoading) {
            setPage(prevState => prevState + 1);
        }
        setIsScrolled(false);
    }, [isScrolled]);

    const handleChangeTab = (event: ChangeEvent<{}>, newValue: number): void => {
        setText("");
        history.replace({pathname: location.pathname, state: {}});
        setActiveTab(newValue);
    };

    const handleClickSearch = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (text !== "") {
            if (activeTab !== 2) {
                dispatch(fetchTweetsByText(encodeURIComponent(text)));
            } else {
                dispatch(fetchUsersSearchByUsername(encodeURIComponent(text)));
            }
        }
    };

    const showTopTweets = (): void => {
        window.scrollTo(0, 0);
        setPage(0);
        dispatch(resetTweets());
        dispatch(fetchTweets(page));
        if (isTweetsLoading) {
            setPage(prevState => prevState + 1);
        }
    };

    const showUsers = (): void => {
        window.scrollTo(0, 0);
        dispatch(fetchUsersSearch());
    };

    const showMediaTweets = (): void => {
        window.scrollTo(0, 0);
        dispatch(fetchMediaTweets());
    };

    const showTweetsWithVideos = (): void => {
        window.scrollTo(0, 0);
        dispatch(fetchTweetsWithVideo());
    };

    const handleFollow = (user: User): void => {
        dispatch(followUser(user));
    };

    const handleUnfollow = (user: User): void => {
        dispatch(unfollowUser(user));
    };

    return (
        <Paper className={classes.container} variant="outlined">
            <Paper className={classes.header} variant="outlined">
                <div>
                    <form style={{display: "block"}} onSubmit={handleClickSearch}>
                        <div className={classes.backButtonWrapper}>
                            <BackButton/>
                        </div>
                        <MainSearchTextField
                            variant="outlined"
                            placeholder="Explore Twitter"
                            onChange={(event) => setText(event.target.value)}
                            value={text}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {SearchIcon}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className={classes.editButton}>
                            <IconButton color="primary">
                                <span>{EditIcon}</span>
                            </IconButton>
                        </div>
                    </form>
                    <div className={classes.tabs}>
                        <Tabs value={activeTab} indicatorColor="primary" textColor="primary" onChange={handleChangeTab}>
                            <Tab onClick={showTopTweets} label="Top"/>
                            <Tab onClick={showTopTweets} label="Latest"/>
                            <Tab onClick={showUsers} label="People"/>
                            <Tab onClick={showMediaTweets} label="Photos"/>
                            <Tab onClick={showTweetsWithVideos} label="Videos"/>
                        </Tabs>
                    </div>
                </div>
            </Paper>
            <div className={classes.contentWrapper}>
                {(isUsersLoading) ? (
                    <div className={classes.loading}>
                        <CircularProgress/>
                    </div>
                ) : (
                    (activeTab !== 2) ? (
                        tweets.map((tweet) => <TweetComponent key={tweet.id} item={tweet}/>)
                    ) : (
                        users?.map((user) => (
                            <Follower
                                key={user.id}
                                item={user}
                                follow={handleFollow}
                                unfollow={handleUnfollow}
                            />
                        ))
                    )
                )}
                {isTweetsLoading && (
                    <div className={classes.loading}>
                        <CircularProgress/>
                    </div>
                )}
            </div>
        </Paper>
    );
};

export default withInfiniteScroll(Explore);
